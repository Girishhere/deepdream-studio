import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation(); // Gets the current URL path

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
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontWeight: 800, letterSpacing: '2px', color: '#fff', cursor: 'pointer' }}>
          DEEPDREAM<span style={{ color: '#3c78ff' }}>STUDIO</span>
        </div>
      </Link>
      
      <div style={{ display: 'flex', gap: '30px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <Link 
          to="/" 
          style={{ 
            color: location.pathname === '/' ? '#fff' : '#666', 
            textDecoration: 'none', transition: 'color 0.3s' 
          }}
        >
          Creative Studio
        </Link>

        <Link 
          to="/forensics" 
          style={{ 
            color: location.pathname === '/forensics' ? '#fff' : '#666', 
            textDecoration: 'none', transition: 'color 0.3s' 
          }}
        >
          Forensic Lab
        </Link>

        <Link 
          to="/resources" 
          style={{ 
            color: location.pathname === '/resources' ? '#fff' : '#666', 
            textDecoration: 'none', transition: 'color 0.3s' 
          }}
        >
          Wiki & Resources
        </Link>
      </div>
    </motion.nav>
  );
}