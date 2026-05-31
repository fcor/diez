import { formatHex, parse, converter } from 'culori'

const toOklch = converter('oklch')

/**
 * Generate harmonious hue offsets from a base hue.
 * Returns an array of hues (0-360).
 */
const HARMONY_RULES = {
  complementary: (base, count) => {
    const hues = []
    for (let i = 0; i < count; i++) {
      hues.push((base + (i % 2 === 0 ? 0 : 180) + i * 15) % 360)
    }
    return hues
  },
  triadic: (base, count) => {
    const offsets = [0, 120, 240]
    const hues = []
    for (let i = 0; i < count; i++) {
      hues.push((base + offsets[i % 3] + Math.floor(i / 3) * 20) % 360)
    }
    return hues
  },
  analogous: (base, count) => {
    const spread = 30
    const hues = []
    const start = base - spread * Math.floor(count / 2)
    for (let i = 0; i < count; i++) {
      hues.push(((start + i * spread) % 360 + 360) % 360)
    }
    return hues
  },
  split: (base, count) => {
    const offsets = [0, 150, 210]
    const hues = []
    for (let i = 0; i < count; i++) {
      hues.push((base + offsets[i % 3] + Math.floor(i / 3) * 20) % 360)
    }
    return hues
  },
}

/**
 * Generate `count` harmonious hex colors.
 * If `anchorHex` is provided, its hue is used as base.
 * Otherwise a random base hue is picked.
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

  const generate = HARMONY_RULES[rule] || HARMONY_RULES.triadic
  const hues = generate(baseHue, count)

  return hues.map(h => {
    const l = 0.55 + Math.random() * 0.25   // lightness: 0.55–0.80
    const c = 0.10 + Math.random() * 0.15   // chroma: 0.10–0.25
    return formatHex({ mode: 'oklch', l, c, h })
  })
}

export const HARMONY_NAMES = Object.keys(HARMONY_RULES)
