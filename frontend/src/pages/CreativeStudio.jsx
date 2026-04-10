import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// --- Core App Components ---
import ImagePanel from '../components/ImagePanel'
import ControlPanel from '../components/ControlPanel'
import LayerSelector from '../components/LayerSelector'
import CNNPipeline from '../components/CNNPipeline'

// --- Landing & UI Components ---
import LandingContent from '../components/LandingContent'
import SmoothScroll from '../components/SmoothScroll'

const API_URL = 'http://localhost:8000/generate-dream/'

export default function CreativeStudio() {
  // --- DeepDream Tool States ---
  const [originalFile, setOriginalFile]       = useState(null)
  const [originalPreview, setOriginalPreview] = useState(null)
  const [dreamedImage, setDreamedImage]       = useState(null)
  const [isLoading, setIsLoading]             = useState(false)
  const [error, setError]                     = useState(null)
  const [selectedLayer, setSelectedLayer]     = useState('Mixed_5b')

  const handleFileChange = useCallback((file) => {
    if (!file) return
    if (originalPreview) URL.revokeObjectURL(originalPreview)
    if (dreamedImage)    URL.revokeObjectURL(dreamedImage)
    setOriginalFile(file)
    setOriginalPreview(URL.createObjectURL(file))
    setDreamedImage(null)
    setError(null)
  }, [originalPreview, dreamedImage])

  const handleGenerate = async () => {
    if (!originalFile || isLoading) return
    setIsLoading(true)
    setError(null)
    if (dreamedImage) URL.revokeObjectURL(dreamedImage)
    setDreamedImage(null)

    try {
      const formData = new FormData()
      formData.append('file', originalFile)
      formData.append('layer_name', selectedLayer)

      const response = await fetch(API_URL, { method: 'POST', body: formData })

      if (!response.ok) {
        let detail = `Server error (${response.status})`
        try { const j = await response.json(); detail = j.detail || detail } catch (_) {}
        throw new Error(detail)
      }

      const blob = await response.blob()
      setDreamedImage(URL.createObjectURL(blob))
    } catch (err) {
      setError(
        err.name === 'TypeError'
          ? 'Cannot reach backend — ensure the FastAPI server is running on port 8000.'
          : err.message
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SmoothScroll>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }} 
        transition={{ duration: 0.5 }}
      >
        <LandingContent />

        <section id="studio" style={{ position: 'relative', zIndex: 10, padding: '40px 5vw', paddingBottom: '100px', maxWidth: '1600px', margin: '0 auto' }}>
          <main className="main" style={{ background: 'rgba(20, 20, 25, 0.4)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            
            {/* Tool Intro & Layer Selector */}
            <div className="hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
              <div className="hero-text" style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '10px', marginTop: 0 }}>The Studio Interface</h2>
                <p style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                  Target a CNN layer, upload an image, and let InceptionV3 amplify
                  what it sees — edges, textures, or full object hallucinations.
                </p>
              </div>

              <LayerSelector
                value={selectedLayer}
                onChange={setSelectedLayer}
                disabled={isLoading}
              />
            </div>

            {/* Error Handling */}
            {error && (
              <div className="error-toast" role="alert" style={{ background: 'rgba(255, 50, 50, 0.1)', border: '1px solid #ff3232', color: '#ff3232', padding: '15px 20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span>⚠️</span>
                <span style={{ flex: 1 }}>{error}</span>
                <button style={{ background: 'none', border: 'none', color: '#ff3232', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setError(null)} aria-label="Dismiss">✕</button>
              </div>
            )}

            {/* Three-column grid */}
            <div className="content-grid" style={{ display: 'flex', gap: '30px', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <ImagePanel
                  title="Original Image"
                  dotColor="#e2e2e2"
                  image={originalPreview}
                  isLoading={false}
                  uploadable={true}
                  onFileChange={handleFileChange}
                />
              </div>

              <div className="pipeline-column" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CNNPipeline
                  isAnimating={isLoading}
                  selectedLayer={selectedLayer}
                />
              </div>

              <div style={{ flex: '1 1 400px', maxWidth: '600px' }}>
                <ImagePanel
                  title="DeepDream Result"
                  dotColor="#34d399"
                  image={dreamedImage}
                  isLoading={isLoading}
                  uploadable={false}
                />
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <ControlPanel
                onGenerate={handleGenerate}
                isLoading={isLoading}
                hasImage={!!originalFile}
                hasDream={dreamedImage}
              />
            </div>
          </main>
        </section>

        <footer style={{ position: 'relative', zIndex: 10, background: 'rgba(10,10,12,0.8)', padding: '20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#666', fontSize: '0.9rem' }}>
          DeepDream Studio & Forensic Lab · built with{' '}
          <a href="https://pytorch.org" target="_blank" rel="noopener noreferrer" style={{ color: '#3c78ff', textDecoration: 'none' }}>PyTorch</a>{' '}
          &{' '}
          <a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', textDecoration: 'none' }}>FastAPI</a>
        </footer>
      </motion.div>
    </SmoothScroll>
  )
}