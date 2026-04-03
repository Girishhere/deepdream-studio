import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DreamCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="dream-cursor-aura"
      animate={{
        x: mousePosition.x - 200, // Offset by half width/height to center
        y: mousePosition.y - 200,
      }}
      transition={{ type: 'spring', damping: 40, stiffness: 200, mass: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120, 60, 255, 0.15) 0%, rgba(60, 200, 255, 0.1) 40%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}