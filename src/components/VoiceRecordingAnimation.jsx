import { motion } from 'framer-motion';

const VoiceRecordingAnimation = () => {
  const barVariants = {
    initial: { scaleY: 0.1 },
    animate: { 
      scaleY: [0.1, 1, 0.1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="voice-recording-container">
      <div className="recording-text">Recording...</div>
      <div className="voice-bars">
        {[1, 2, 3, 4, 5].map((bar) => (
          <motion.div 
            key={bar}
            className="voice-bar"
            variants={barVariants}
            initial="initial"
            animate="animate"
            style={{ animationDelay: `${bar * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceRecordingAnimation;