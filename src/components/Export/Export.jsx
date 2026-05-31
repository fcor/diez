import { useState, useMemo, useRef, useEffect } from 'react'
import { usePalette } from '../../context/PaletteContext'
import styles from './Export.module.css'

const FORMATS = ['css', 'glsl', 'p5']

function hexToGlslVec3(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return `vec3(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`
}

function generateCSS(colors) {
  const vars = colors
    .map((c, i) => `  --palette-${i + 1}: ${c.hex};`)
    .join('\n')
  return `:root {\n${vars}\n}`
}

function generateGLSL(colors) {
  const len = colors.length
  const header = `uniform vec3 palette[${len}];`
  const values = colors
    .map((c, i) => `palette[${i}] = ${hexToGlslVec3(c.hex)}; // ${c.hex}`)
    .join('\n')
  return `${header}\n\n${values}`
}

function generateP5(colors) {
  const hexes = colors.map(c => `"${c.hex}"`).join(', ')
  return `const colors = [${hexes}];`
}

const GENERATORS = { css: generateCSS, glsl: generateGLSL, p5: generateP5 }

function Export() {
  const palette = usePalette()
  const [format, setFormat] = useState('css')
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const toggleRef = useRef(null)
  const [pos, setPos] = useState({ bottom: 0, right: 0 })

  const output = useMemo(
    () => GENERATORS[format](palette),
    [format, palette]
  )

  useEffect(() => {
    if (open && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect()
      setPos({
        bottom: window.innerHeight - rect.top + 4,
        right: window.innerWidth - rect.right,
      })
    }
  }, [open])

  function handleCopy() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={styles.wrapper}>
      <button ref={toggleRef} className={styles.toggle} onClick={() => setOpen(!open)}>
        {open ? '[-] EXPORT' : '[+] EXPORT'}
      </button>
      {open && (
        <div
          className={styles.drawer}
          style={{ bottom: pos.bottom, right: pos.right }}
        >
          <div className={styles.header}>
            <span className={styles.title}>EXPORT</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '+ copied!' : '+ copy'}
            </button>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              [x]
            </button>
          </div>

          <div className={styles.formats}>
            {FORMATS.map(f => (
              <button
                key={f}
                className={`${styles.option} ${format === f ? styles.active : ''}`}
                onClick={() => setFormat(f)}
              >
                {format === f ? `(*) ${f}` : `( ) ${f}`}
              </button>
            ))}
          </div>

          <pre className={styles.code}>{output}</pre>
        </div>
      )}
    </div>
  )
}

export default Export
