import { motion } from 'framer-motion';
import '../styles/WelcomeScreen.css';
import AnimatedBackground from './AnimatedBackground';
import { useState } from 'react';
import FaceAuthentication from './FaceAuthentication';

// eslint-disable-next-line react/prop-types
const WelcomeScreen = ({ onStartChat }) => {
  const [faceAuthModalOpen, setFaceAuthModalOpen] = useState(false);

  function handleLoginClick() {
   setFaceAuthModalOpen(true);
  }
  
  return (
    <div className="welcome-container">
      <FaceAuthentication open={faceAuthModalOpen}/>
      <AnimatedBackground />
      <div className="welcome-content">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="welcome-heading"
        >
          Hello Human
        </motion.h1>
        <motion.button 
          onClick={onStartChat}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="onboard-button"
        >
          Onboard to Future
        </motion.button>
        <motion.button 
          onClick={handleLoginClick}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="onboard-button"
        >
          Login
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomeScreen;