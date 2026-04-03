// frontend/src/components/NavBar.jsx
import { motion } from 'framer-motion';

export default function NavBar({ currentView, setCurrentView }) {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        background: 'rgba(10, 10, 12, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5vw', zIndex: 100,
      }}
    >
      <div 
        onClick={() => setCurrentView('home')}
        style={{ fontWeight: 800, letterSpacing: '2px', color: '#fff', cursor: 'pointer' }}
      >
        DEEPDREAM<span style={{ color: '#3c78ff' }}>STUDIO</span>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <span 
          onClick={() => setCurrentView('home')} 
          style={{ color: currentView === 'home' ? '#fff' : '#666', cursor: 'pointer', transition: 'color 0.3s' }}
        >
          The Application
        </span>
        <span 
          onClick={() => setCurrentView('resources')} 
          style={{ color: currentView === 'resources' ? '#fff' : '#666', cursor: 'pointer', transition: 'color 0.3s' }}
        >
          Learning & Resources
        </span>
      </div>
    </motion.nav>
  );
}