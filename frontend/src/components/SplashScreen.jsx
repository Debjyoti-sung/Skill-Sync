import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to auth page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-animation">
          <h1 className="brand-name">
            <span className="skill">Skill</span>
            <span className="sync">Sync</span>
          </h1>
          <div className="tagline">Transform Your Learning Journey</div>
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
