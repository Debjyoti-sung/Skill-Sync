const express = require('express');
const router = express.Router();
const { getSession } = require('../config/neo4j');

// Career path suggestions based on skills
router.get('/paths/:userId', async (req, res) => {
  const session = getSession();
  try {
    const { userId } = req.params;

    // Get user skills
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:KNOWS]->(s:Skill)
       RETURN collect(s.name) AS skills`,
      { userId }
    );

    const userSkills = result.records[0]?.get('skills') || [];

    // Career paths based on skills
    const careerPaths = [
      {
        title: 'Full Stack Developer',
        matchingSkills: userSkills.filter(s => 
          ['javascript', 'react', 'node', 'nodejs', 'express', 'mongodb'].includes(s)
        ),
        requiredSkills: ['javascript', 'react', 'nodejs', 'database', 'api'],
        salary: '$80k - $120k',
        demand: 'High'
      },
      {
        title: 'Data Scientist',
        matchingSkills: userSkills.filter(s => 
          ['python', 'machine learning', 'data science', 'sql'].includes(s)
        ),
        requiredSkills: ['python', 'statistics', 'machine learning', 'sql'],
        salary: '$90k - $140k',
        demand: 'Very High'
      },
      {
        title: 'DevOps Engineer',
        matchingSkills: userSkills.filter(s => 
          ['docker', 'kubernetes', 'git', 'linux'].includes(s)
        ),
        requiredSkills: ['docker', 'kubernetes', 'ci/cd', 'cloud', 'linux'],
        salary: '$85k - $130k',
        demand: 'High'
      }
    ];

    // Calculate match percentage
    const pathsWithScore = careerPaths.map(path => ({
      ...path,
      matchScore: Math.round((path.matchingSkills.length / path.requiredSkills.length) * 100),
      missingSkills: path.requiredSkills.filter(s => !userSkills.includes(s))
    })).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ paths: pathsWithScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

module.exports = router;