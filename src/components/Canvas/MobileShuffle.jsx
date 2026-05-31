import { usePaletteDispatch } from '../../context/PaletteContext'
import styles from './Canvas.module.css'

function MobileShuffle() {
  const dispatch = usePaletteDispatch()
  return (
    <button
      className={styles.mobileShuffle}
      onClick={() => dispatch({ type: 'SHUFFLE', rule: 'triadic' })}
    >
      [ SHUFFLE ]
    </button>
  )
}

export default MobileShuffle
