import { usePalette, usePaletteDispatch } from '../../context/PaletteContext'
import styles from './ColorList.module.css'

function ColorList() {
  const colors = usePalette()
  const dispatch = usePaletteDispatch()

  return (
    <div className={styles.list}>
      {colors.map(color => (
        <div key={color.id} className={styles.row}>
          <span className={styles.swatch} style={{ color: color.hex }}>████{'\n'}████{'\n'}████</span>
          <input
            className={styles.hex}
            type="text"
            value={color.hex}
            onChange={e => dispatch({
              type: 'UPDATE_COLOR',
              id: color.id,
              hex: e.target.value,
            })}
          />
          <button
            className={`${styles.action} ${color.locked ? styles.active : ''}`}
            onClick={() => dispatch({ type: 'TOGGLE_LOCK', id: color.id })}
          >
            {color.locked ? '[LOCK]' : '[LOCK]'}
          </button>
          <button
            className={styles.action}
            onClick={() => dispatch({ type: 'REMOVE_COLOR', id: color.id })}
          >
            [DEL]
          </button>
        </div>
      ))}
      {colors.length === 0 && (
        <div className={styles.empty}>no colors yet</div>
      )}
    </div>
  )
}

export default ColorList
