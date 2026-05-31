/* ============================================================
   Diez — Canvas Algorithms
   Each algorithm defines:
     chars   — density ramp (light → heavy)
     init?   — (cols, rows) → state object
     update? — (state, cols, rows, dt, speed) → state
     sample  — (x, y, t, cols, rows, mx, my, state) → { value: 0-1, char? }
   ============================================================ */

// ── Matrix character set ──────────────────────────────────────
const MATRIX_CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789:·=*+-|'

function randomMatrixChar() {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
}

function createDrop(col, rows) {
  return {
    x: col,
    y: -Math.random() * rows,
    speed: 5 + Math.random() * 12,
    length: 5 + Math.floor(Math.random() * 25),
    chars: Array.from({ length: 30 }, randomMatrixChar),
  }
}

// ── Mondrian subdivision ──────────────────────────────────────

function subdivide(cols, rows) {
  let squares = [{ x: 0, y: 0, w: cols, h: rows }]

  const stepX = Math.max(4, Math.floor(cols / 6))
  const stepY = Math.max(3, Math.floor(rows / 5))

  for (let i = stepX; i < cols; i += stepX) {
    splitSquaresX(squares, i)
  }
  for (let i = stepY; i < rows; i += stepY) {
    splitSquaresY(squares, i)
  }

  for (const sq of squares) {
    sq.value = 0.15 + Math.random() * 0.85
  }

  return squares
}

function splitSquaresX(squares, splitAt) {
  for (let i = squares.length - 1; i >= 0; i--) {
    const sq = squares[i]
    if (splitAt > sq.x && splitAt < sq.x + sq.w) {
      if (Math.random() > 0.5) {
        squares.splice(i, 1)
        squares.push(
          { x: sq.x, y: sq.y, w: splitAt - sq.x, h: sq.h },
          { x: splitAt, y: sq.y, w: sq.x + sq.w - splitAt, h: sq.h }
        )
      }
    }
  }
}

function splitSquaresY(squares, splitAt) {
  for (let i = squares.length - 1; i >= 0; i--) {
    const sq = squares[i]
    if (splitAt > sq.y && splitAt < sq.y + sq.h) {
      if (Math.random() > 0.5) {
        squares.splice(i, 1)
        squares.push(
          { x: sq.x, y: sq.y, w: sq.w, h: splitAt - sq.y },
          { x: sq.x, y: splitAt, w: sq.w, h: sq.y + sq.h - splitAt }
        )
      }
    }
  }
}

function bakeGrid(squares, cols, rows) {
  const grid = Array.from({ length: rows }, () => new Float32Array(cols))

  for (const sq of squares) {
    const x1 = Math.round(sq.x)
    const y1 = Math.round(sq.y)
    const x2 = Math.min(cols, Math.round(sq.x + sq.w))
    const y2 = Math.min(rows, Math.round(sq.y + sq.h))

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        grid[y][x] = sq.value
      }
    }
  }

  return grid
}

// ── Algorithms ────────────────────────────────────────────────

export const ALGORITHMS = {

  noise: {
    chars: ' ░░▒▒▓▓██',
    sample(x, y, t, cols, rows, mx, my) {
      const nx = x / cols
      const ny = y / rows
      const dx = nx - mx
      const dy = ny - my
      const md = Math.sqrt(dx * dx + dy * dy)
      const mouse = Math.exp(-md * 4) * Math.sin(md * 20 - t * 3) * 0.15

      const v =
        (Math.sin(nx * 8 + t) +
          Math.sin(ny * 6 + t * 0.7) +
          Math.sin((nx + ny) * 5 + t * 0.5) +
          Math.sin(Math.sqrt(nx * nx + ny * ny) * 8 - t)) /
          4 * 0.5 + 0.5 + mouse

      return { value: v }
    },
  },

  cruzdiez: {
    chars: null,
    sample(x, y, t, cols, rows, mx, my) {
      // Layer 1 — vertical strips, slow drift
      const stripe1 = Math.sin(x * 0.35 + t * 0.4)

      // Layer 2 — slightly different frequency, mouse shifts phase
      const stripe2 = Math.sin(x * 0.45 + t * -0.3 + mx * 1.5)

      // Layer 3 — wider bands, very slow
      const stripe3 = Math.sin(x * 0.15 + t * 0.15)

      // Interference between layers creates color transitions
      const combined = (stripe1 + stripe2 + stripe3) / 3
      const v = combined * 0.5 + 0.5

      const abs = Math.abs(combined)
      let ch
      if (abs > 0.6) ch = '█'
      else if (abs > 0.35) ch = '▓'
      else if (abs > 0.15) ch = '│'
      else ch = '┊'

      return { value: Math.max(0, Math.min(1, v)), char: ch }
    },
  },

  matrix: {
    chars: null,
    init(cols, rows) {
      const drops = []
      for (let col = 0; col < cols; col++) {
        const n = 1 + Math.floor(Math.random() * 2)
        for (let d = 0; d < n; d++) {
          drops.push(createDrop(col, rows))
        }
      }
      return { drops, cols, rows, grid: null, charGrid: null }
    },
    update(state, cols, rows, dt, speed) {
      if (cols !== state.cols || rows !== state.rows) {
        return ALGORITHMS.matrix.init(cols, rows)
      }

      const grid = Array.from({ length: rows }, () => new Float32Array(cols))
      const charGrid = Array.from({ length: rows }, () => new Array(cols).fill(' '))

      for (const drop of state.drops) {
        drop.y += drop.speed * dt * speed

        if (Math.random() < 0.15) {
          const idx = Math.floor(Math.random() * drop.chars.length)
          drop.chars[idx] = randomMatrixChar()
        }

        const headY = Math.floor(drop.y)
        for (let i = 0; i < drop.length; i++) {
          const gy = headY - i
          if (gy >= 0 && gy < rows && drop.x < cols) {
            const brightness = i === 0 ? 1.0 : (1 - i / drop.length) * 0.8
            if (brightness > grid[gy][drop.x]) {
              grid[gy][drop.x] = brightness
              charGrid[gy][drop.x] =
                i === 0 ? randomMatrixChar() : drop.chars[i % drop.chars.length]
            }
          }
        }

        if (headY - drop.length > rows) {
          Object.assign(drop, createDrop(drop.x, rows))
        }
      }

      state.grid = grid
      state.charGrid = charGrid
      return state
    },
    sample(x, y, t, cols, rows, mx, my, state) {
      if (!state?.grid) return { value: 0, char: ' ' }
      return {
        value: state.grid[y]?.[x] || 0,
        char: state.charGrid[y]?.[x] || ' ',
      }
    },
  },

  grid: {
    chars: null,
    init(cols, rows) {
      const squares = subdivide(cols, rows)
      return {
        grid: bakeGrid(squares, cols, rows),
        elapsed: 0,
        cols,
        rows,
      }
    },
    update(state, cols, rows, dt) {
      state.elapsed += dt
      if (state.elapsed > 5 || cols !== state.cols || rows !== state.rows) {
        return ALGORITHMS.grid.init(cols, rows)
      }
      return state
    },
    sample(x, y, t, cols, rows, mx, my, state) {
      if (!state?.grid?.[y]) return { value: 0, char: ' ' }
      const v = state.grid[y][x]
      if (v <= 0) return { value: 0, char: ' ' }
      return { value: v, char: '█' }
    },
  },

}

export const ALGO_NAMES = Object.keys(ALGORITHMS)

export const SPEEDS = [
  { label: 'slow', value: 0.3 },
  { label: 'med', value: 1 },
  { label: 'fast', value: 3 },
]
