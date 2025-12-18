import React, { useState } from 'react';
import axios from 'axios';
import './SkillExtractor.css';

function SkillExtractor({ user }) {
  const [text, setText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const extractSkills = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/skills/extract', { text });
      setExtractedSkills(response.data.skills);
    } catch (error) {
      console.error('Error extracting skills:', error);
    }
    setLoading(false);
  };

  const addSkill = async (skill) => {
    try {
      await axios.post('http://localhost:5000/api/skills/add', {
        userId: user.id,
        skill,
        relatedSkills: extractedSkills.filter(s => s !== skill).slice(0, 3)
      });
      alert(`Skill "${skill}" added to your profile!`);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  return (
    <div className="container">
      <div className="skill-extractor card">
        <h1>🎯 Skill Extraction</h1>
        <p className="subtitle">Paste your learning content, resume, or project description</p>

        <div className="input-group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here... e.g., 'Built a full-stack application using React, Node.js, and MongoDB...'"
            rows="10"
          />
        </div>

        <button 
          onClick={extractSkills} 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Extracting...' : 'Extract Skills'}
        </button>

        {extractedSkills.length > 0 && (
          <div className="extracted-skills">
            <h2>Extracted Skills</h2>
            <div className="skills-container">
              {extractedSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-tag">{skill}</span>
                  <button 
                    onClick={() => addSkill(skill)}
                    className="btn btn-secondary btn-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillExtractor;