/**
 * CNNPipeline — animated 3D visualization of the InceptionV3 forward pass.
 * Uses framer-motion for sequenced animation when `isAnimating` is true.
 * Features 3D hover physics, glass lighting, and comet-tail data particles.
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Pipeline stages ──────────────────────────────────────────────────────── */
const STAGES = [
  { id: 'input', label: 'Input', sublabel: 'Image tensor', icon: '⬛' },
  { id: 'conv2d', label: 'Conv2d', sublabel: '7×7 stride 2', icon: '◈' },
  { id: 'maxpool', label: 'MaxPool', sublabel: '3×3 stride 2', icon: '◧' },
  { id: 'mixed3b', label: 'Conv2d_4a_3x3', sublabel: 'Edges & lines', icon: '◇', layerKey: 'Conv2d_4a_3x3', color: 'var(--layer-3b)' },
  { id: 'mixed4c', label: 'Mixed_7a', sublabel: 'Textures', icon: '◈', layerKey: 'Mixed_7a', color: 'var(--layer-4c)' },
  { id: 'mixed5b', label: 'Mixed_5b', sublabel: 'Objects', icon: '◉', layerKey: 'Mixed_5b', color: 'var(--layer-5b)' },
  { id: 'output', label: 'Output', sublabel: 'Dream tensor', icon: '⬛' },
]

/* ─── Tiny connector particle ──────────────────────────────────────────────── */
function DataParticle({ isActive, color }) {
  return (
    <div style={{ position: 'relative', width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Static line */}
      <div style={{
        width: '100%', height: 1,
        background: isActive ? color || 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)',
        transition: 'background 0.4s',
        position: 'absolute',
      }} />
      {/* Travelling particle (Comet Tail Update) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="particle"
            initial={{ x: -10, opacity: 0, scale: 0.4 }}
            animate={{ x: 10, opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: 0.55, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.15 }}
            style={{
              width: 15,
              height: 3,
              borderRadius: '4px',
              background: `linear-gradient(90deg, transparent 0%, ${color || '#fff'} 100%)`,
              position: 'absolute',
              boxShadow: `2px 0 6px ${color || '#fff'}`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Stage node ───────────────────────────────────────────────────────────── */
function StageNode({ stage, isActive, isTarget, isReached, activeColor }) {
  // Physical Glass Lighting Update
  const glassGlow = isTarget
    ? `inset 0 1px 1px rgba(255,255,255,0.4), 0 8px 20px ${stage.color}40, 0 0 16px ${stage.color}`
    : isReached
      ? `inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5)`
      : `inset 0 1px 1px rgba(255,255,255,0.02)`

  const borderColor = isTarget
    ? stage.color
    : isReached
      ? 'rgba(255,255,255,0.25)'
      : 'rgba(255,255,255,0.07)'

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }} // Holographic Hover Physics
      animate={{
        scale: isActive ? 1.1 : isReached ? 1.04 : 1,
        opacity: isReached ? 1 : 0.4,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'default',
        perspective: 600, // Necessary for the hover tilt
      }}
    >
      {/* Node box */}
      <motion.div
        animate={{ boxShadow: glassGlow, borderColor }} // Applied Glass Glow
        transition={{ duration: 0.4 }}
        style={{
          width: 44, height: 44,
          borderRadius: 10,
          background: isTarget
            ? `${stage.color}18`
            : isReached
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.02)',
          border: `1px solid ${borderColor}`,
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
          color: isTarget ? stage.color : isReached ? '#fff' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.3s',
          perspective: 600,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.span
          animate={{ rotateY: isActive ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {stage.icon}
        </motion.span>
      </motion.div>

      {/* Labels */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: isTarget ? stage.color : isReached ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
          transition: 'color 0.3s',
        }}>
          {stage.label}
        </div>
        <div style={{
          fontSize: '0.55rem',
          color: 'rgba(255,255,255,0.25)',
          marginTop: 1,
          whiteSpace: 'nowrap',
        }}>
          {stage.sublabel}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export default function CNNPipeline({ isAnimating, selectedLayer }) {
  // reachedIndex: how far through the pipeline the animation has progressed
  const [reachedIndex, setReachedIndex] = useState(-1)
  const [activeIndex, setActiveIndex] = useState(-1)

  const targetIndex = STAGES.findIndex((s) => s.layerKey === selectedLayer)
  const activeColor = STAGES[targetIndex]?.color || '#fff'

  useEffect(() => {
    if (!isAnimating) {
      // Reset or hold at last completed
      setReachedIndex(-1)
      setActiveIndex(-1)
      return
    }

    // Sweep through stages one by one, stopping at target layer then continuing to output
    let i = 0
    setReachedIndex(-1)
    setActiveIndex(-1)

    const tick = () => {
      if (i >= STAGES.length) return
      setActiveIndex(i)
      setReachedIndex(i)
      i++
      const delay = i - 1 === targetIndex ? 800 : 350
      setTimeout(tick, delay)
    }
    tick()
  }, [isAnimating, selectedLayer])

  return (
    <div
      aria-label="CNN pipeline visualization"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 0',
        height: '100%',
        perspective: 800,
      }}
    >
      {/* Title */}
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        marginBottom: 10,
        textAlign: 'center',
      }}>
        CNN Pipeline
      </div>

      {/* Vertical stage list */}
      {STAGES.map((stage, idx) => (
        <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <StageNode
            stage={stage}
            isActive={activeIndex === idx}
            isTarget={stage.layerKey === selectedLayer}
            isReached={reachedIndex >= idx}
            activeColor={activeColor}
          />
          {/* Connector (between nodes, not after last) */}
          {idx < STAGES.length - 1 && (
            <DataParticle
              isActive={isAnimating && reachedIndex > idx}
              color={
                idx >= (targetIndex - 1) && idx < targetIndex
                  ? activeColor
                  : 'rgba(255,255,255,0.4)'
              }
            />
          )}
        </div>
      ))}

      {/* Idle hint */}
      {!isAnimating && (
        <div style={{
          marginTop: 12,
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.15)',
          textAlign: 'center',
          lineHeight: 1.4,
          maxWidth: 120,
        }}>
          Animation plays during generation
        </div>
      )}

      {/* Active glow backdrop */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              width: 120, height: 300,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${activeColor}18 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}