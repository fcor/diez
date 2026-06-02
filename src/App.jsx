import { useState, useCallback } from 'react'
import styles from './App.module.css'
import Panel from './components/Panel/Panel'
import PaletteBar from './components/PaletteBar/PaletteBar'
import ColorList from './components/ColorList/ColorList'
import ColorInput from './components/ColorInput/ColorInput'
import Logo from './components/Logo/Logo'
import Canvas from './components/Canvas/Canvas'
import CanvasControls from './components/Canvas/CanvasControls'
import MobileShuffle from './components/Canvas/MobileShuffle'
import Export from './components/Export/Export'
import About from './components/About/About'
import aboutStyles from './components/About/About.module.css'
import { PaletteProvider } from './context/PaletteContext'

function App() {
  const [algo, setAlgo] = useState('matrix')
  const [speed, setSpeed] = useState(1)
  const [aboutOpen, setAboutOpen] = useState(false)
  const openAbout = useCallback(() => setAboutOpen(true), [])
  const closeAbout = useCallback(() => setAboutOpen(false), [])

  return (
    <PaletteProvider>
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Logo />
          <span className={styles.tagline}>colors → code → art</span>
        </div>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <Panel title="Palette">
            <ColorList />
            <ColorInput onOpenAbout={openAbout} />
          </Panel>
        </aside>

        <section className={styles.stage}>
          <Panel title="Canvas">
            <Canvas algo={algo} speed={speed} />
          </Panel>
          <Panel title="Controls" className={styles.controlsPanel}>
            <div className={styles.controlsRow}>
              <CanvasControls algo={algo} setAlgo={setAlgo} speed={speed} setSpeed={setSpeed} />
              <div className={styles.actions}>
                <MobileShuffle />
                <Export />
                <button
                  className={aboutStyles.triggerMobile}
                  onClick={openAbout}
                  aria-label="About"
                >
                  [?]
                </button>
              </div>
            </div>
          </Panel>
        </section>
      </main>

      <footer className={styles.bar}>
        <Panel title="Colors">
          <PaletteBar />
        </Panel>
      </footer>

      <About open={aboutOpen} onClose={closeAbout} />
    </div>
    </PaletteProvider>
  )
}

export default App
