import { formatHex, parse, converter } from 'culori'

const toOklch = converter('oklch')

/**
 * Hue offset (degrees) at position `i` for each harmony rule.
 * i=0 is the base hue. The reducer skips i=0 when an anchor is present
 * so unlocked slots never collide with the locked color's hue.
 */
const HARMONY_OFFSETS = {
  triadic: i => [0, 120, 240][i % 3] + Math.floor(i / 3) * 20,
  complementary: i => (i % 2 === 0 ? 0 : 180) + i * 15,
  split: i => [0, 150, 210][i % 3] + Math.floor(i / 3) * 20,
  // 0, +30, -30, +60, -60, +90, ... — symmetric neighbors at any count.
  analogous: i => i === 0 ? 0 : (i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * 30,
}

function mod360(h) {
  return ((h % 360) + 360) % 360
}

/**
 * Generate `count` harmonious hex colors.
 * If `anchorHex` is provided, its hue seeds the harmony and unlocked
 * slots fill positions 1..count (the anchor occupies position 0).
 * Otherwise a random base hue is picked and slots fill 0..count-1.
 */
export function generateHarmony(rule, count, anchorHex) {
  let baseHue = Math.random() * 360

  if (anchorHex) {
    const parsed = parse(anchorHex)
    if (parsed) {
      const oklch = toOklch(parsed)
      if (oklch && oklch.h != null) baseHue = oklch.h
    }
  }

  const offsetAt = HARMONY_OFFSETS[rule] || HARMONY_OFFSETS.triadic
  const start = anchorHex ? 1 : 0

  return Array.from({ length: count }, (_, i) => {
    const h = mod360(baseHue + offsetAt(start + i))
    const l = 0.55 + Math.random() * 0.25   // lightness: 0.55–0.80
    const c = 0.10 + Math.random() * 0.15   // chroma: 0.10–0.25
    return formatHex({ mode: 'oklch', l, c, h })
  })
}

export const HARMONY_NAMES = Object.keys(HARMONY_OFFSETS)
