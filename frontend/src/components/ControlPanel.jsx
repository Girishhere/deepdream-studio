/**
 * ControlPanel — status indicator, generate button, download link.
 */
export default function ControlPanel({ onGenerate, isLoading, hasImage, hasDream }) {
  const statusText = isLoading
    ? 'Running gradient ascent…'
    : hasDream
    ? 'Dream generated successfully'
    : hasImage
    ? 'Ready — click Generate Dream'
    : 'Upload an image to begin'

  const dotColor = isLoading
    ? 'var(--amber)'
    : hasDream
    ? 'var(--green)'
    : 'var(--accent-muted)'

  const dotShadow = isLoading
    ? '0 0 8px var(--amber)'
    : hasDream
    ? '0 0 8px var(--green)'
    : 'none'

  return (
    <div className="controls-bar" role="toolbar">
      {/* Status */}
      <div className="status-indicator">
        <div
          className="status-dot"
          style={{ background: dotColor, boxShadow: dotShadow }}
          aria-hidden="true"
        />
        <span>{statusText}</span>
      </div>

      {/* Generate */}
      <button
        id="generate-dream-btn"
        className="btn-generate"
        onClick={onGenerate}
        disabled={!hasImage || isLoading}
        aria-busy={isLoading}
        aria-label="Generate DeepDream image"
      >
        {isLoading ? '⏳ Dreaming…' : '✦ Generate Dream'}
      </button>

      {/* Download */}
      {hasDream && !isLoading && (
        <a
          id="download-dream-btn"
          href={hasDream}
          download="deepdream-result.jpg"
          className="btn-download"
          aria-label="Download result image"
        >
          ↓ Save
        </a>
      )}
    </div>
  )
}
