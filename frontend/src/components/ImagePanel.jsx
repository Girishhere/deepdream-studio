import { useRef, useState } from 'react'
import { ImageIcon, Sparkles } from "lucide-react";

export default function ImagePanel({
  title, dotColor, image, isLoading,
  uploadable = false, onFileChange,
}) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && onFileChange) onFileChange(file)
  }

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onFileChange) onFileChange(file)
  }

  return (
    <section className="image-panel" aria-label={title}>
      <div className="panel-header">
        <div className="panel-dot" style={{ background: dotColor }} />
        <span className="panel-title">{title}</span>
      </div>

      <div className="panel-body">
        {/* Loading */}
        {isLoading && (
          <div className="loading-overlay" role="status">
            <div className="neural-spinner" aria-hidden="true">
              <div className="spinner-ring" />
              <div className="spinner-ring" />
              <div className="spinner-ring" />
            </div>
            <div className="loading-text">
              <strong>Processing gradients…</strong>
              <span>Amplifying neural activations</span>
            </div>
            <div className="loading-progress">
              <div className="loading-progress-fill" />
            </div>
          </div>
        )}

        {/* Result image */}
        {image && !isLoading && (
          <>
            <img src={image} alt={title} className="preview-img" draggable={false} />
            {uploadable && (
              <div className="preview-overlay">
                <button className="change-btn" onClick={() => inputRef.current?.click()}>
                  ↩ Change
                </button>
                <input
                  ref={inputRef} type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
              </div>
            )}
          </>
        )}

        {/* Upload zone */}
        {!image && !isLoading && uploadable && (
          <div
            className={`upload-zone${dragOver ? ' drag-over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            role="button" tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              id="image-upload-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange}
            />
           <div className="upload-icon-box">
  <ImageIcon size={26} strokeWidth={1.5} />
</div>
            <div className="upload-label">
              <strong>Drop an image here</strong>
              <span>or click to browse · JPG, PNG, WebP</span>
            </div>
          </div>
        )}

        {/* Empty (dream panel) */}
        {!image && !isLoading && !uploadable && (
          <div className="empty-state">
<div className="empty-icon-box">
  <Sparkles size={26} strokeWidth={1.5} />
</div>            <p className="empty-title">Awaiting Dream Output</p>
            <p className="empty-sub">
              Select a layer, upload an image, then click Generate
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
