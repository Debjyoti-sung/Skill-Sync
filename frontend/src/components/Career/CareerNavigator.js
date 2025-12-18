import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CareerNavigator.css';

function CareerNavigator({ user }) {
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareerPaths();
  }, [user]);

  const loadCareerPaths = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://https://skill-sync-bl6v.onrender.com//api/career/paths/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCareerPaths(response.data.paths);
      setLoading(false);
    } catch (error) {
      console.error('Error loading career paths:', error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="career-header">
        <h1>🚀 Career Navigator</h1>
        <p className="subtitle">Discover career paths based on your skills</p>
      </div>

      {loading ? (
        <div className="card">
          <p className="empty-state">Loading career insights...</p>
        </div>
      ) : (
        <div className="career-paths">
          {careerPaths.map((path, index) => (
            <div key={index} className="career-card card">
              <div className="career-header-section">
                <h2>{path.title}</h2>
                <div className="match-score">
                  <div className="score-circle">
                    <span className="score-number">{path.matchScore}%</span>
                    <span className="score-label">Match</span>
                  </div>
                </div>
              </div>

              <div className="career-details">
                <div className="detail-item">
                  <span className="detail-label">💰 Salary Range</span>
                  <span className="detail-value">{path.salary}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📈 Demand</span>
                  <span className="detail-value">{path.demand}</span>
                </div>
              </div>

              <div className="skills-section">
                <h3>✅ Your Matching Skills</h3>
                <div className="skills-tags">
                  {path.matchingSkills.length > 0 ? (
                    path.matchingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag matched">{skill}</span>
                    ))
                  ) : (
                    <p className="no-skills">Start adding skills to see matches!</p>
                  )}
                </div>
              </div>

              {path.missingSkills.length > 0 && (
                <div className="skills-section">
                  <h3>📚 Skills to Learn</h3>
                  <div className="skills-tags">
                    {path.missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${path.matchScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CareerNavigator;