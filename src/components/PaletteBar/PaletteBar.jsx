import { usePalette } from '../../context/PaletteContext'
import styles from './PaletteBar.module.css'

function PaletteBar() {
  const colors = usePalette()

  return (
    <div className={styles.bar}>
      {colors.map(color => (
        <div
          key={color.id}
          className={styles.swatch}
          style={{ borderColor: color.hex }}
        >
          <div
            className={styles.fill}
            style={{ backgroundColor: color.hex }}
          >
            <span className={styles.hex}>{color.hex}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PaletteBar
