const express = require('express');
const router = express.Router();
const natural = require('natural');
const compromise = require('compromise');
const { getSession } = require('../config/neo4j');

// NLP Skill Extraction
router.post('/extract', async (req, res) => {
  try {
    const { text } = req.body;

    // Extract skills using NLP
    const doc = compromise(text);

    // Extract technical terms and nouns as potential skills
    const nouns = doc.nouns().out('array');
    const skills = [];

    // Common tech skills dictionary
    const techSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'nodejs', 'express',
      'mongodb', 'sql', 'html', 'css', 'git', 'docker', 'kubernetes',
      'machine learning', 'ai', 'data science', 'algorithm', 'database',
      'api', 'rest', 'graphql', 'typescript', 'vue', 'angular'
    ];

    // Check for tech skills in text
    const lowerText = text.toLowerCase();
    techSkills.forEach(skill => {
      if (lowerText.includes(skill)) {
        skills.push(skill);
      }
    });

    // Add relevant nouns
    nouns.forEach(noun => {
      if (noun.length > 3 && !skills.includes(noun.toLowerCase())) {
        skills.push(noun.toLowerCase());
      }
    });

    res.json({ skills: [...new Set(skills)].slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add skill to user's graph
router.post('/add', async (req, res) => {
  const session = getSession();
  try {
    const { userId, skill, relatedSkills = [] } = req.body;

    // Create skill node and relationships in Neo4j
    await session.run(
      `MERGE (u:User {id: $userId})
       MERGE (s:Skill {name: $skill})
       MERGE (u)-[:KNOWS]->(s)
       WITH s
       UNWIND $relatedSkills AS related
       MERGE (rs:Skill {name: related})
       MERGE (s)-[:RELATED_TO]->(rs)
       RETURN s`,
      { userId, skill, relatedSkills }
    );

    res.json({ message: 'Skill added successfully', skill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// Get user's skill graph
router.get('/graph/:userId', async (req, res) => {
  const session = getSession();
  try {
    const { userId } = req.params;

    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:KNOWS]->(s:Skill)
       OPTIONAL MATCH (s)-[:RELATED_TO]->(rs:Skill)
       RETURN s.name AS skill, collect(rs.name) AS relatedSkills`,
      { userId }
    );

    const skills = result.records.map(record => ({
      skill: record.get('skill'),
      relatedSkills: record.get('relatedSkills').filter(s => s !== null)
    }));

    res.json({ skills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

module.exports = router;