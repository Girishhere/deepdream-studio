/**
 * LayerSelector — dropdown for choosing the InceptionV3 target layer.
 */

const LAYERS = [
  {
    // Replaced Conv2d_4a_3x3
    value: 'Conv2d_4a_3x3',
    label: 'Conv2d_4a_3x3 — Edges & Lines',
    description: 'Basic geometric structures',
    color: 'var(--layer-3b)',
  },
  {
    // Keeping Mixed_5b as the mid-point (since it worked successfully)
    value: 'Mixed_5b',
    label: 'Mixed_5b — Textures & Patterns',
    description: 'Complex textures and recurring patterns',
    color: 'var(--layer-4c)',
  },
  {
    // Replaced Mixed_7a with a very deep layer for extreme hallucinations
    value: 'Mixed_7a',
    label: 'Mixed_7a — Objects & Eyes',
    description: 'High-level feature representations',
    color: 'var(--layer-5b)',
  },
]

export { LAYERS }

export default function LayerSelector({ value, onChange, disabled }) {
  // Defaulting to index 1 (Mixed_5b) if no value is matched
  const active = LAYERS.find((l) => l.value === value) || LAYERS[1]

  return (
    <div className="layer-selector">
      <label htmlFor="layer-select-input">Target CNN Layer</label>
      <div className="layer-select-wrapper">
        <select
          id="layer-select-input"
          className="layer-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label="Select InceptionV3 layer to target"
        >
          {LAYERS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <span className="layer-select-arrow" aria-hidden="true">▼</span>
      </div>
      <div className="layer-badge">
        <span className="layer-dot" style={{ background: active.color }} />
        <span>{active.description}</span>
      </div>
    </div>
  )
}