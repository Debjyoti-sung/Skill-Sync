import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import './TypewriterHero.css';

const TypewriterHero = () => {
  return (
    <div className="typewriter-hero">
      <TypeAnimation
        sequence={[
          'Skill Sync',
          2000,
          'Let\'s Start',
          2000,
          'Solve',
          2000,
          'Secure',
          2000,
        ]}
        wrapper="h1"
        speed={50}
        className="typewriter-text"
        repeat={Infinity}
      />
    </div>
  );
};

export default TypewriterHero;
