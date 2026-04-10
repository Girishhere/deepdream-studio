import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ImagePanel from '../components/ImagePanel';

const API_URL = 'http://localhost:8000/detect-fake/';

export default function ForensicLab() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((file) => {
    if (!file) return;
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setResults(null);
    setError(null);
  }, [originalPreview]);

  const handleAnalyze = async () => {
    if (!originalFile || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', originalFile);

      const response = await fetch(API_URL, { method: 'POST', body: formData });

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(
        err.name === 'TypeError'
          ? 'Cannot reach backend — ensure FastAPI is running on port 8000.'
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '100px 5vw', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 15px 0' }}>AI Forensic Lab</h1>
        <p style={{ color: '#aaa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Upload an image to our EfficientNetB0 classifier. If it suspects AI generation, it will use Grad-CAM to highlight exactly which pixels gave it away.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(255, 50, 50, 0.1)', border: '1px solid #ff3232', color: '#ff3232', padding: '15px 20px', borderRadius: '12px', marginBottom: '30px', textAlign: 'center' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Upload Column */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
          <ImagePanel
            title="Evidence Upload"
            dotColor="#e2e2e2"
            image={originalPreview}
            isLoading={false}
            uploadable={true}
            onFileChange={handleFileChange}
          />
          
          <button 
            onClick={handleAnalyze}
            disabled={!originalFile || isLoading}
            style={{
              width: '100%',
              padding: '15px',
              marginTop: '20px',
              background: isLoading || !originalFile ? '#333' : '#3c78ff',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              cursor: isLoading || !originalFile ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.3s ease'
            }}
          >
            {isLoading ? 'Running Diagnostics...' : 'Run Forensic Analysis'}
          </button>
        </div>

        {/* Results Column */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
          <div style={{ 
            background: 'rgba(20, 20, 25, 0.6)', 
            border: '1px solid rgba(255,255,255,0.08)', 
            borderRadius: '24px', 
            padding: '30px',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ff3c78' }}></span>
              Diagnostic Results
            </h3>

            {results ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ marginBottom: '20px', padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '5px' }}>Prediction:</div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: results.prediction === 'Real' ? '#34d399' : '#ff3c78' 
                  }}>
                    {results.prediction} ({results.confidence}%)
                  </div>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>Grad-CAM Explainability Map:</div>
                <img 
                  src={results.heatmap} 
                  alt="Grad-CAM Heatmap" 
                  style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} 
                />
              </motion.div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                Awaiting Evidence...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}