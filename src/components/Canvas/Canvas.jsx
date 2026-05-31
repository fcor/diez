import { useRef, useEffect } from 'react'
import p5 from 'p5'
import { usePalette } from '../../context/PaletteContext'
import { ALGORITHMS } from './algorithms'
import styles from './Canvas.module.css'

export { ALGO_NAMES, SPEEDS } from './algorithms'

function Canvas({ algo, speed }) {
  const palette = usePalette()
  const containerRef = useRef(null)

  // Mutable refs so the p5 draw loop always reads current values
  const paletteRef = useRef(palette)
  const algoRef = useRef(algo)
  const speedRef = useRef(speed)

  useEffect(() => { paletteRef.current = palette }, [palette])
  useEffect(() => { algoRef.current = algo }, [algo])
  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cols = 0
    let rows = 0
    let charW = 0
    let charH = 0
    let state = null
    let lastAlgo = null
    let accTime = 0

    // Smoothed mouse — lerps toward real cursor
    let smoothMx = 0.5
    let smoothMy = 0.5

    const sketch = (p) => {
      p.setup = () => {
        const rect = container.getBoundingClientRect()
        const canvas = p.createCanvas(rect.width, rect.height)
        canvas.style('display', 'block')

        // Read font from design-system tokens
        const cs = getComputedStyle(container)
        const fontFamily = cs.fontFamily
        const fontSize = parseFloat(cs.fontSize) || 14
        const lineHeight = parseFloat(cs.lineHeight) || fontSize * 1.4

        // Configure canvas text rendering
        const ctx = p.drawingContext
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.textBaseline = 'top'

        charW = ctx.measureText('M').width
        charH = lineHeight
        cols = Math.floor(p.width / charW)
        rows = Math.floor(p.height / charH)

        p.noStroke()
        p.noSmooth()

        lastAlgo = algoRef.current
        const alg = ALGORITHMS[lastAlgo]
        state = alg.init ? alg.init(cols, rows) : null
      }

      p.draw = () => {
        const pal = paletteRef.current
        if (!pal || pal.length === 0 || cols === 0) return

        const currentAlgo = algoRef.current
        const alg = ALGORITHMS[currentAlgo]
        if (!alg) return

        // Reinit state on algo change
        if (currentAlgo !== lastAlgo) {
          lastAlgo = currentAlgo
          state = alg.init ? alg.init(cols, rows) : null
          accTime = 0
        }

        const spd = speedRef.current
        const dt = p.deltaTime / 1000
        accTime += dt * spd

        // Smooth mouse — lerp toward real cursor position
        const rawMx = Math.max(0, Math.min(1, p.mouseX / p.width))
        const rawMy = Math.max(0, Math.min(1, p.mouseY / p.height))
        const ease = 1 - Math.exp(-2.5 * dt)
        smoothMx += (rawMx - smoothMx) * ease
        smoothMy += (rawMy - smoothMy) * ease
        const mx = smoothMx
        const my = smoothMy

        // Update stateful algorithms
        if (alg.update && state) {
          state = alg.update(state, cols, rows, dt, spd)
        }

        // Clear to bg
        const ctx = p.drawingContext
        ctx.clearRect(0, 0, p.width, p.height)

        // Render character grid
        let prevColor = null
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const result = alg.sample(x, y, accTime, cols, rows, mx, my, state)
            const value = Math.max(0, Math.min(1, result.value))

            if (value < 0.02) continue

            const colorIdx = Math.min(
              Math.floor(value * pal.length),
              pal.length - 1
            )
            const hex = pal[colorIdx].hex

            let ch = result.char
            if (!ch && alg.chars) {
              const ci = Math.floor(value * (alg.chars.length - 1))
              ch = alg.chars[ci]
            }

            if (ch && ch !== ' ') {
              if (hex !== prevColor) {
                ctx.fillStyle = hex
                prevColor = hex
              }
              ctx.fillText(ch, x * charW, y * charH)
            }
          }
        }
      }
    }

    const instance = new p5(sketch, container)

    // Resize on container layout changes (flex, panels)
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0 && charW > 0) {
        instance.resizeCanvas(width, height)
        cols = Math.floor(width / charW)
        rows = Math.floor(height / charH)
        const alg = ALGORITHMS[algoRef.current]
        state = alg.init ? alg.init(cols, rows) : null
      }
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      instance.remove()
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvas} ref={containerRef} />
    </div>
  )
}

export default Canvas
