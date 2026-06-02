import { useEffect } from 'react'
import styles from './About.module.css'

function About({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span id="about-title" className={styles.title}>ABOUT</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close about panel"
          >
            [x]
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.lead}>
            <span className={styles.brand}>DIEZ</span>
            <span className={styles.tagline}> — colors → code → art</span>
          </p>

          <p>
            A palette tool for creative coders, shader artists, and
            generative designers. Build a palette, watch it drive a
            live ASCII canvas, and export to CSS, GLSL, or p5.js.
          </p>

          <p>
            Named after <em>Carlos Cruz-Diez</em> (1923–2019),
            Venezuelan kinetic artist whose <em>Physichromies</em>{' '}
            explored color as something that moves, shifts, and
            depends on the viewer.
          </p>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>─ References ─</span>
            <ul className={styles.list}>
              <li>Cogmind · Monodraw · Zed</li>
              <li>Cruz-Diez Physichromies</li>
            </ul>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>─ Built with ─</span>
            <ul className={styles.list}>
              <li>React · p5.js · culori · Vite</li>
            </ul>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>─ By ─</span>
            <ul className={styles.list}>
              <li>Fabio Cortés · 2026</li>
              <li>
                <a
                  className={styles.link}
                  href="https://github.com/fcor/diez"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  github.com/fcor/diez
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
