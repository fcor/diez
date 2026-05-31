import { BORDERS } from '../../utils/borders'
import styles from './Panel.module.css'

const H_FILL = BORDERS.h.repeat(200)
const V_FILL = (BORDERS.v + '\n').repeat(200)

function Panel({ title, children, className }) {

  return (
    <div className={`${styles.panel} ${className || ''}`}>
      <div className={styles.borderTop}>
        <span className={styles.corner}>{BORDERS.tl}</span>
        {title ? (
          <>
            <span className={styles.titleOffset}>{H_FILL}</span>
            <span className={styles.title}>
              {' '}{title.toUpperCase()}{' '}
            </span>
            <span className={styles.fill}>{H_FILL}</span>
          </>
        ) : (
          <span className={styles.fill}>{H_FILL}</span>
        )}
        <span className={styles.corner}>{BORDERS.tr}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.side}>{V_FILL}</div>
        <div className={styles.content}>{children}</div>
        <div className={styles.side}>{V_FILL}</div>
      </div>

      <div className={styles.borderBottom}>
        <span className={styles.corner}>{BORDERS.bl}</span>
        <span className={styles.fill}>{H_FILL}</span>
        <span className={styles.corner}>{BORDERS.br}</span>
      </div>
    </div>
  )
}

export default Panel
