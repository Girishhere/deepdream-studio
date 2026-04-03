import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Reusable Fade Wrapper ---
const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// --- 1. The X-Ray Binary Hero (Kept because it looks awesome) ---
const HeroShatter = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const binaryString = "0 1 0 0 1 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 ".repeat(800);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', backgroundColor: '#020202', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        color: '#3c78ff', fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
        wordBreak: 'break-all', zIndex: 0, padding: '20px', opacity: 0.8, lineHeight: '1.2'
      }}>
        {binaryString}
      </div>

      <motion.div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: '#0a0a0c', zIndex: 1,
        WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 90%)`,
        maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 90%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', zIndex: 2, pointerEvents: 'none' }}>
          {/* <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(60,120,255,0.1)', border: '1px solid rgba(60,120,255,0.3)', borderRadius: '30px', color: '#88aaff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', marginBottom: '30px' }}>
            
          </div> */}
          <h1 style={{ fontSize: '7rem', fontWeight: 900, lineHeight: '1.05', margin: '0 0 25px 0', background: 'linear-gradient(180deg, #ffffff 0%, #a0c0ff 50%, #3c78ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-3px' }}>
Deep Dream AI          </h1>
          <p style={{ fontSize: '1.4rem', color: '#999', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6', fontWeight: 300 }}>
            Visualizing Neural Network Features through Artistic Image Generation
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. The Detailed Architecture Flowchart ---
const ArchitecturePipeline = () => {
  const steps = [
    {
      id: "01",
      title: "React & Framer Motion Frontend",
      tech: "CLIENT SIDE",
      desc: "The user uploads a base image and selects a target CNN layer (e.g., Mixed_5b for textures). The React UI packages this data and streams it asynchronously to the backend.",
      color: "#61dafb", // React Blue
      align: "left"
    },
    {
      id: "02",
      title: "FastAPI REST Gateway",
      tech: "SERVER SIDE",
      desc: "A high-performance Python FastAPI server receives the payload. It handles image normalization, memory management, and bridges the gap between the web request and the heavy ML computation.",
      color: "#059669", // FastAPI Green
      align: "right"
    },
    {
      id: "03",
      title: "PyTorch InceptionV3 Hook",
      tech: "AI ENGINE",
      desc: "The image is converted into a PyTorch tensor. We load a pre-trained InceptionV3 model and attach a 'forward hook' exactly at the layer the user selected, isolating those specific neural activations.",
      color: "#ee4c2c", // PyTorch Red
      align: "left"
    },
    {
      id: "04",
      title: "Gradient Ascent Optimization",
      tech: "AI ENGINE",
      desc: "Instead of training the model, we freeze the network and update the image pixels. We calculate the L2 norm of the hooked layer and run gradient ascent to amplify whatever patterns the AI 'sees'.",
      color: "#f59e0b", // Warning Yellow
      align: "right"
    },
    {
      id: "05",
      title: "Multi-Scale Octave Processing",
      tech: "POST-PROCESSING",
      desc: "To create detailed fractals, the image is repeatedly downscaled and processed in a loop (octaves). The accumulated hallucination details are blended together and sent back to the React UI as a blob.",
      color: "#8b5cf6", // Purple
      align: "left"
    }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', backgroundColor: '#050507', padding: '120px 0', overflow: 'hidden' }}>
      
      {/* Background Grid */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: '100px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: '0 0 15px 0' }}>System Architecture.</h2>
            <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>A simple breakdown of the system pipeline.</p>
          </div>
        </FadeInSection>

        <div style={{ position: 'relative' }}>
          
          {/* THE ANIMATED CENTER LINE */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, width: '4px', background: 'linear-gradient(to bottom, #61dafb, #059669, #ee4c2c, #f59e0b, #8b5cf6)', borderRadius: '4px', boxShadow: '0 0 20px rgba(60,120,255,0.2)' }}
          />

          {/* THE STEPS */}
          {steps.map((step, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: step.align === 'left' ? 'flex-start' : 'flex-end', width: '100%', paddingBottom: '80px', position: 'relative' }}>
              
              {/* The Glowing Node on the center line */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                style={{ position: 'absolute', left: '50%', top: '30px', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: step.color, border: '4px solid #0a0a0c', zIndex: 2, boxShadow: `0 0 15px ${step.color}` }}
              />

              {/* The Content Card */}
              <motion.div 
                initial={{ opacity: 0, x: step.align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ width: '42%', background: 'rgba(20,20,25,0.8)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', backdropFilter: 'blur(10px)', borderTop: `4px solid ${step.color}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>{step.id}</span>
                  <span style={{ padding: '4px 10px', background: `${step.color}20`, color: step.color, borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px' }}>{step.tech}</span>
                </div>
                <h3 style={{ fontSize: '1.6rem', color: '#fff', margin: '0 0 15px 0', letterSpacing: '-0.5px' }}>{step.title}</h3>
                <p style={{ color: '#aaa', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
              </motion.div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

// --- 3. The Premium Architects Section ---
/*const ArchitectsSection = () => {
  const team = [
    { name: "Rajnish Kumar", id: "2411CS030551"},
    { name: "K.Sasi Kiran", id: "2411CS030595"},
    { name: "Girish Choudhary", id: "2411CS030598"},
    { name: "T.Prudhvi Raj Singh", id: "2411CS030599"}
  ];

  return (
    <section id="about" style={{ padding: '120px 10%', width: '100%', backgroundColor: '#020202', position: 'relative', overflow: 'hidden' }}>
      <FadeInSection>
        <h2 style={{ fontSize: '4rem', marginBottom: '15px', fontWeight: 900, letterSpacing: '-2px', color: '#fff', textAlign: 'center' }}>Batch 1</h2>
        <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '80px', maxWidth: '500px', margin: '0 auto 80px auto', textAlign: 'center' }}>The architects behind DeepDream Studio. Section DS / ZETA.</p>
      </FadeInSection>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', position: 'relative', zIndex: 10 }}>
        {team.map((member, i) => (
          <FadeInSection key={i} delay={i * 0.15}>
            <motion.div 
              whileHover={{ y: -10, backgroundColor: 'rgba(30, 30, 40, 0.8)', borderColor: 'rgba(60, 120, 255, 0.4)' }}
              style={{ background: 'rgba(20, 20, 25, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px 25px', borderRadius: '20px', transition: 'all 0.3s', display: 'flex', flexDirection: 'column', height: '100%' }} 
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 5px 0' }}>{member.name}</h4>
                <p style={{ color: '#3c78ff', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 20px 0' }}>{member.role}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '20px' }}>
                <span style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.8rem' }}>{member.id}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
              </div>
            </motion.div>
          </FadeInSection>
        ))}
      </div>
    </section>
  );
}; */

export default function LandingContent() {
  return (
    <div style={{ width: '100%', color: '#fff', position: 'relative', zIndex: 1, backgroundColor: '#020202' }}>
      <HeroShatter />
      <ArchitecturePipeline />
      {/*<ArchitectsSection />*/}
    </div>
  );
}