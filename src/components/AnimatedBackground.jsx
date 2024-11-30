import { motion } from 'framer-motion';
import '../styles/AnimatedBackground.css';

const AnimatedBackground = () => {
  const shapes = Array.from({ length: 10 }).map((_, index) => ({
    id: index,
    size: Math.random() * 100 + 50,
    delay: Math.random() * 2,
    duration: Math.random() * 5 + 3,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  }));

  return (
    <div className="animated-background">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="background-shape"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}px`,
            top: `${shape.y}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0], 
            scale: [0, 1, 0],
            x: [0, shape.x, 0],
            y: [0, shape.y, 0]
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;