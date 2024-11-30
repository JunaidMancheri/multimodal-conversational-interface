import { motion } from 'framer-motion';
import '../styles/WelcomeScreen.css';
import AnimatedBackground from './AnimatedBackground';

// eslint-disable-next-line react/prop-types
const WelcomeScreen = ({ onStartChat }) => {
  
  return (
    <div className="welcome-container">
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
      </div>
    </div>
  );
};

export default WelcomeScreen;