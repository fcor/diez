import { usePalette } from '../../context/PaletteContext'
import styles from './Logo.module.css'

/*
  Solid colored rectangles, drawn back-to-front.
  Overlapping blocks form "DIEZ" — inspired by
  Cruz-Diez's layered color strips.
  ci = color index (cycles through palette via modulo).
  Coords in 10-unit cells; viewBox is 250x70 (25w x 7h cells).
*/
const LAYERS = [
  // D — top/bottom 5 wide (notched corners), right bar drawn last
  { x: 0,  y: 0, w: 2, h: 7, ci: 0 },
  { x: 1,  y: 0, w: 5, h: 2, ci: 1 },
  { x: 1,  y: 5, w: 5, h: 2, ci: 3 },
  { x: 5,  y: 1, w: 2, h: 5, ci: 2 },

  // I
  { x: 8,  y: 0, w: 2, h: 7, ci: 4 },

  // E
  { x: 11, y: 0, w: 2, h: 7, ci: 0 },
  { x: 12, y: 0, w: 5, h: 2, ci: 1 },
  { x: 12, y: 3, w: 4, h: 1, ci: 2 },
  { x: 12, y: 5, w: 5, h: 2, ci: 3 },

  // Z
  { x: 18, y: 0, w: 7, h: 2, ci: 4 },
  { x: 22, y: 2, w: 3, h: 1, ci: 0 },
  { x: 20, y: 3, w: 3, h: 1, ci: 2 },
  { x: 18, y: 4, w: 3, h: 1, ci: 3 },
  { x: 18, y: 5, w: 7, h: 2, ci: 1 },
]

function Logo() {
  const palette = usePalette()
  const colorAt = (i) =>
    palette.length > 0 ? palette[i % palette.length].hex : 'currentColor'

  return (
    <svg
      className={styles.logo}
      viewBox="0 0 250 70"
      shapeRendering="crispEdges"
      role="img"
      aria-label="DIEZ"
    >
      {LAYERS.map((r, i) => (
        <rect
          key={i}
          x={r.x * 10}
          y={r.y * 10}
          width={r.w * 10}
          height={r.h * 10}
          fill={colorAt(r.ci)}
        />
      ))}
    </svg>
  )
}

export default Logo
