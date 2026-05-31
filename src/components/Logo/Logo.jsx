import { usePalette } from '../../context/PaletteContext'
import styles from './Logo.module.css'

const GRID_W = 25
const GRID_H = 7

/*
  Solid colored rectangles, drawn back-to-front.
  Overlapping blocks form "DIEZ" — inspired by
  Cruz-Diez's layered color strips.
  ci = color index (cycles through palette via modulo).
*/
const LAYERS = [
  // D — four bars forming the letter
  // Top/bottom are 5 wide (notched corners) so the silhouette reads as D, not O.
  // Right bar drawn last so it overlaps both notches symmetrically.
  { x: 0,  y: 0, w: 2, h: 7, ci: 0 },   // left spine
  { x: 1,  y: 0, w: 5, h: 2, ci: 1 },   // top bar
  { x: 1,  y: 5, w: 5, h: 2, ci: 3 },   // bottom bar
  { x: 5,  y: 1, w: 2, h: 5, ci: 2 },   // right bar

  // I
  { x: 8,  y: 0, w: 2, h: 7, ci: 4 },

  // E — spine + three bars
  { x: 11, y: 0, w: 2, h: 7, ci: 0 },   // left spine
  { x: 12, y: 0, w: 5, h: 2, ci: 1 },   // top
  { x: 12, y: 3, w: 4, h: 1, ci: 2 },   // middle (single row)
  { x: 12, y: 5, w: 5, h: 2, ci: 3 },   // bottom

  // Z — top/bottom bars + stepped diagonal
  { x: 18, y: 0, w: 7, h: 2, ci: 4 },   // top
  { x: 22, y: 2, w: 3, h: 1, ci: 0 },   // diagonal step right
  { x: 20, y: 3, w: 3, h: 1, ci: 2 },   // diagonal step center
  { x: 18, y: 4, w: 3, h: 1, ci: 3 },   // diagonal step left
  { x: 18, y: 5, w: 7, h: 2, ci: 1 },   // bottom
]

function buildGrid(palette) {
  const grid = Array.from({ length: GRID_H }, () =>
    Array.from({ length: GRID_W }, () => ({ ch: ' ', color: null }))
  )

  for (const { x, y, w, h, ci } of LAYERS) {
    const hex = palette.length > 0
      ? palette[ci % palette.length].hex
      : null

    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        grid[row][col] = { ch: '█', color: hex }
      }
    }
  }

  return grid
}

function Logo() {
  const palette = usePalette()
  const grid = buildGrid(palette)

  return (
    <pre className={styles.logo}>
      {grid.map((row, y) => (
        <div key={y} className={styles.row}>
          {row.map((cell, x) => (
            <span
              key={x}
              className={cell.color ? undefined : styles.dim}
              style={cell.color ? { color: cell.color } : undefined}
            >
              {cell.ch}
            </span>
          ))}
        </div>
      ))}
    </pre>
  )
}

export default Logo
