import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './GoalSetup.css';

const GoalSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goalType } = location.state || {};

  // Get tomorrow's date as default start date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    goalType: goalType || '',
    sourceUrl: '',
    hoursPerDay: 1,
    startDate: getTomorrowDate(),
    deadline: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://skill-sync-bl6v.onrender.com/api/goals',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Show success message
      alert('Goal setup successful! Reloading to your dashboard...');

      // Mark user as onboarded
      localStorage.setItem('hasCompletedOnboarding', 'true');

      // Reload and navigate to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to setup goal');
      setLoading(false);
    }
  };

  const goalTitle = goalType === 'competitive-exam' 
    ? 'Competitive Exam' 
    : 'Job & Internship';

  return (
    <div className="goal-setup-container">
      <div className="goal-setup-form">
        <h1 className="setup-title">Setup Your {goalTitle} Goal</h1>
        <p className="setup-subtitle">Let's plan your learning journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sourceUrl">
              <span className="label-icon">🔗</span>
              Source URL
            </label>
            <input
              type="url"
              id="sourceUrl"
              name="sourceUrl"
              placeholder="Paste the web URL (e.g., course link, study material)"
              value={formData.sourceUrl}
              onChange={handleChange}
              required
            />
            <small>Add the link to your study resource or course</small>
          </div>

          <div className="form-group">
            <label htmlFor="hoursPerDay">
              <span className="label-icon">⏰</span>
              Hours Per Day
            </label>
            <input
              type="number"
              id="hoursPerDay"
              name="hoursPerDay"
              min="1"
              max="24"
              value={formData.hoursPerDay}
              onChange={handleChange}
              required
            />
            <small>How many hours can you dedicate daily?</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">
                <span className="label-icon">📅</span>
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={getTomorrowDate()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">
                <span className="label-icon">🎯</span>
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={formData.startDate}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Setting Up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalSetup;
