import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import DreamCursor from './components/DreamCursor';
import ResourcesPage from './components/ResourcesPage';

// Pages
import CreativeStudio from './pages/CreativeStudio';
import ForensicLab from './pages/ForensicLab';

export default function App() {
  return (
    <Router>
      <div style={{ background: '#0a0a0c', minHeight: '100vh', position: 'relative', fontFamily: 'Inter, sans-serif', overflowX: 'clip' }}>
        
        {/* These components appear on every page */}
        <DreamCursor />
        <NavBar /> 
        
        {/* Page Routing */}
        <Routes>
          <Route path="/" element={<CreativeStudio />} />
          <Route path="/forensics" element={<ForensicLab />} />
          <Route path="/resources" element={<div style={{ paddingTop: '80px' }}><ResourcesPage /></div>} />
        </Routes>

      </div>
    </Router>
  );
}