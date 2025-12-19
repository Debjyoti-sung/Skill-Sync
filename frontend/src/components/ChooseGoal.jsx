import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChooseGoal.css';

const ChooseGoal = () => {
  const navigate = useNavigate();

  const handleGoalSelect = (goalType) => {
    if (goalType === 'custom') {
      // Navigate directly to dashboard for custom
      navigate('/dashboard');
    } else {
      // Navigate to goal setup form
      navigate('/goal-setup', { state: { goalType } });
    }
  };

  return (
    <div className="choose-goal-container">
      <div className="choose-goal-content">
        <h1 className="goal-title">Choose Your Goal</h1>
        <p className="goal-subtitle">Select what you want to achieve</p>

        <div className="goal-cards">
          <div className="goal-card" onClick={() => handleGoalSelect('competitive-exam')}>
            <div className="goal-icon">📚</div>
            <h3>Competitive Exam</h3>
            <p>Prepare for entrance exams, certifications, and competitive tests</p>
            <button className="goal-button">Select</button>
          </div>

          <div className="goal-card" onClick={() => handleGoalSelect('job-internship')}>
            <div className="goal-icon">💼</div>
            <h3>Job & Internship</h3>
            <p>Build skills for career opportunities and professional growth</p>
            <button className="goal-button">Select</button>
          </div>

          <div className="goal-card" onClick={() => handleGoalSelect('custom')}>
            <div className="goal-icon">🎯</div>
            <h3>Custom Your Own</h3>
            <p>Create a personalized learning path tailored to your needs</p>
            <button className="goal-button">Select</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseGoal;
