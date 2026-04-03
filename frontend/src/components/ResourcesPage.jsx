import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FadeInSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// --- NEW: Interactive CNN Pipeline Component ---
const InteractiveCNNExplainer = () => {
  const [activeLayer, setActiveLayer] = useState(1);

  const layers = [
    {
      id: 1,
      short: "Input",
      name: "1. Raw Input Tensor",
      desc: "The image is loaded as a 3D matrix (Width x Height x 3 RGB channels). The network hasn't learned anything yet; it just sees raw numerical color values.",
      color: "#ffffff",
      visual: "linear-gradient(45deg, #ff5f56 0%, #ffbd2e 50%, #27c93f 100%)"
    },
    {
      id: 2,
      short: "Conv2D",
      name: "2. Early Convolutions",
      desc: "Acting like human visual cortex filters, these shallow layers scan the image to detect fundamental building blocks: straight lines, sharp edges, and basic gradients.",
      color: "#3c78ff",
      visual: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(60,120,255,0.4) 10px, rgba(60,120,255,0.4) 20px)"
    },
    {
      id: 3,
      short: "MaxPool",
      name: "3. Pooling & Downsampling",
      desc: "The network shrinks the spatial dimensions of the data. It keeps the most prominent edges while discarding the noise, making the computation faster and more focused.",
      color: "#88aaff",
      visual: "radial-gradient(circle, rgba(136,170,255,0.5) 20%, transparent 20%)"
    },
    {
      id: 4,
      short: "Mixed",
      name: "4. Deep Inception Blocks",
      desc: "Here is where the magic happens for DeepDream! The network combines those simple edges into complex, abstract geometries, repeating textures, and surreal fractals.",
      color: "#34d399",
      visual: "repeating-radial-gradient(circle at 0 0, transparent 0, rgba(52,211,153,0.3) 20px), repeating-linear-gradient(rgba(52,211,153,0.2), rgba(52,211,153,0.2))"
    },
    {
      id: 5,
      short: "Output",
      name: "5. Object Hallucination",
      desc: "At the deepest layers, the AI tries to assemble the textures into recognizable concepts it was trained on—resulting in the famous hallucinated eyes, faces, and 'dog-slugs'.",
      color: "#f59e0b",
      visual: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.6) 0%, rgba(245,158,11,0.1) 50%, transparent 100%)"
    }
  ];

  const activeData = layers.find(l => l.id === activeLayer);

  return (
    <div style={{ background: 'rgba(20,20,25,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', marginTop: '40px' }}>
      <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '30px', textAlign: 'center' }}>Interactive CNN Anatomy</h3>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Left Side: The Clickable Pipeline */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
          {/* Connecting Line */}
          <div style={{ position: 'absolute', left: '24px', top: '20px', bottom: '20px', width: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
          
          {layers.map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <div 
                key={layer.id} 
                onClick={() => setActiveLayer(layer.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', position: 'relative', zIndex: 1 }}
              >
                <motion.div 
                  animate={{ 
                    scale: isActive ? 1.2 : 1, 
                    backgroundColor: isActive ? layer.color : '#222',
                    borderColor: isActive ? layer.color : '#444'
                  }}
                  style={{ width: '50px', height: '50px', borderRadius: '12px', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#000' : '#888', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.3s' }}
                >
                  {layer.id}
                </motion.div>
                <span style={{ color: isActive ? '#fff' : '#888', fontSize: '1.1rem', fontWeight: isActive ? 700 : 400, transition: 'color 0.3s' }}>
                  {layer.short}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Side: The Dynamic Explanation Panel */}
        <div style={{ flex: '2 1 400px', background: 'rgba(10,10,12,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Abstract Visual Box */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeData.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              style={{ height: '150px', width: '100%', background: activeData.visual, backgroundSize: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', color: '#fff', fontSize: '0.8rem', letterSpacing: '2px' }}>FEATURE VISUALIZATION</span>
            </motion.div>
          </AnimatePresence>

          {/* Text Content */}
          <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeData.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h4 style={{ color: activeData.color, fontSize: '1.8rem', marginBottom: '15px', marginTop: 0 }}>{activeData.name}</h4>
                <p style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{activeData.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main Resources Page ---
export default function ResourcesPage() {
  return (
    <div style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '100vh', color: '#fff', maxWidth: '1200px', margin: '0 auto', padding: '120px 5vw 100px 5vw' }}>
      
      <FadeInSection>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px', background: 'linear-gradient(90deg, #fff, #3c78ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Project Wiki & Resources
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '800px', lineHeight: '1.6', marginBottom: '60px' }}>
          A deep dive into the underlying technology, theoretical frameworks, and real-world implications of DeepDream Studio.
        </p>
      </FadeInSection>

      {/* Inserted the new Interactive Explainer Here! */}
      <FadeInSection delay={0.1}>
        <InteractiveCNNExplainer />
      </FadeInSection>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '60px' }}>
        
        {/* ROW 1: Core Concepts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <FadeInSection delay={0.2}>
            <div style={{ background: 'rgba(20, 20, 25, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', height: '100%' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#3c78ff', marginBottom: '20px', marginTop: 0 }}>What is a CNN?</h3>
              <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>
                Convolutional Neural Networks (CNNs) are specialized deep neural networks designed to process pixel data. They use mathematical operations called convolutions to filter images, extracting simple features like edges in early layers, and assembling them into complex objects like faces or buildings in deeper layers.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.3}>
            <div style={{ background: 'rgba(20, 20, 25, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '24px', height: '100%' }}>
              <h3 style={{ fontSize: '1.8rem', color: '#34d399', marginBottom: '20px', marginTop: 0 }}>What is DeepDream?</h3>
              <p style={{ color: '#ccc', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>
                DeepDream is an algorithmic experiment. Instead of training a network to recognize objects, it reverses the process. By using <strong>Gradient Ascent</strong>, we ask the network to tweak the original image pixels to maximize the activation of a specific layer. This forces the AI to "hallucinate."
              </p>
            </div>
          </FadeInSection>
        </div>

        {/* ROW 2: Future Scope & Real World */}
        <FadeInSection delay={0.4}>
          <div style={{ background: 'rgba(60, 120, 255, 0.05)', border: '1px solid rgba(60, 120, 255, 0.2)', padding: '50px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '30px', marginTop: 0 }}>Real-World Implementation & Future Scope</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
              <div>
                <h4 style={{ color: '#88aaff', fontSize: '1.2rem', marginBottom: '10px', marginTop: 0 }}>1. AI Interpretability</h4>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>DeepDream isn't just for art; it's a diagnostic tool. By seeing what a network hallucinates, researchers can verify if an AI is learning the right features.</p>
              </div>
              <div>
                <h4 style={{ color: '#88aaff', fontSize: '1.2rem', marginBottom: '10px', marginTop: 0 }}>2. Generative Art & Media</h4>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>The techniques developed here laid the groundwork for modern generative AI (like Stable Diffusion). Future scope includes real-time DeepDream rendering for VR.</p>
              </div>
              <div>
                <h4 style={{ color: '#88aaff', fontSize: '1.2rem', marginBottom: '10px', marginTop: 0 }}>3. Advanced Data Augmentation</h4>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>Hallucinated images can be fed back into other neural networks to train them on edge cases, improving the robustness of autonomous driving systems.</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* ROW 3: Web Articles */}
        <FadeInSection delay={0.5}>
          <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '20px', marginTop: '40px' }}>External Articles & Papers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <a href="https://research.google/blog/inceptionism-going-deeper-into-neural-networks/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.1rem' }}>Inceptionism: Going Deeper into Neural Networks</h4>
                  <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Google Research Blog (The original DeepDream publication)</p>
                </div>
                <span style={{ color: '#3c78ff' }}>Read Article ↗</span>
              </div>
            </a>
            <a href="https://arxiv.org/abs/1512.00567" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '20px 30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.1rem' }}>Rethinking the Inception Architecture for Computer Vision</h4>
                  <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>Cornell University arXiv (The InceptionV3 Paper)</p>
                </div>
                <span style={{ color: '#3c78ff' }}>Read Paper ↗</span>
              </div>
            </a>
          </div>
        </FadeInSection>

      </div>
    </div>
  );
}