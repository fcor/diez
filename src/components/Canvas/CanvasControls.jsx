import { ALGO_NAMES, SPEEDS } from './Canvas'
import styles from './Canvas.module.css'

function CanvasControls({ algo, setAlgo, speed, setSpeed }) {
  return (
    <div className={styles.controls}>
      <div className={styles.field}>
        <span className={styles.label}>algo:</span>
        {ALGO_NAMES.map(name => (
          <button
            key={name}
            className={`${styles.option} ${algo === name ? styles.active : ''}`}
            onClick={() => setAlgo(name)}
          >
            {algo === name ? `(*) ${name}` : `( ) ${name}`}
          </button>
        ))}
      </div>
      <div className={styles.field}>
        <span className={styles.label}>speed:</span>
        {SPEEDS.map(s => (
          <button
            key={s.label}
            className={`${styles.option} ${speed === s.value ? styles.active : ''}`}
            onClick={() => setSpeed(s.value)}
          >
            {speed === s.value ? `(*) ${s.label}` : `( ) ${s.label}`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CanvasControls
