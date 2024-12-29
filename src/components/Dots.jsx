import React, { useEffect, useState } from 'react';
import '../styles/Dots.css';

const Dots = () => {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generateDots = () => {
      const newDots = [];
      const spacing = 40; // Space between dots in pixels
      
      // Get window dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate number of dots based on spacing
      const columns = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      
      // Add some padding to center the grid
      const xOffset = (width - (columns * spacing)) / 2;
      const yOffset = (height - (rows * spacing)) / 2;
      
      // Generate grid of dots
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          newDots.push({
            id: `${row}-${col}`,
            x: xOffset + (col * spacing),
            y: yOffset + (row * spacing),
            // Randomly decide if dot should animate
            animate: Math.random() > 0.7
          });
        }
      }
      
      setDots(newDots);
    };

    // Generate initial dots
    generateDots();

    // Regenerate dots on window resize
    window.addEventListener('resize', generateDots);
    
    return () => {
      window.removeEventListener('resize', generateDots);
    };
  }, []);

  return (
    <div className="dots-container">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`dot ${dot.animate ? 'animate' : ''}`}
          style={{
            left: `${dot.x}px`,
            top: `${dot.y}px`,
          }}
        />
      ))}
    </div>
  );
};

export default Dots;