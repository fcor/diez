import { useState } from 'react'
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
import { PaletteProvider } from './context/PaletteContext'

function App() {
  const [algo, setAlgo] = useState('matrix')
  const [speed, setSpeed] = useState(1)

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
            <ColorInput />
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
    </div>
    </PaletteProvider>
  )
}

export default App
