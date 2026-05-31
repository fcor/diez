const HEX_RE = /^[0-9a-f]{6}$/i

export function encodePalette(colors) {
  const p = colors.map(c => c.hex.replace('#', '').toLowerCase()).join('-')
  const lockedIndices = colors
    .map((c, i) => (c.locked ? i + 1 : null))
    .filter(n => n !== null)
  return { p, l: lockedIndices.join(',') }
}

export function decodePalette(p, l) {
  if (!p) return null
  const parts = p.split('-').map(s => s.trim()).filter(Boolean)
  if (parts.length === 0) return null

  for (const hex of parts) {
    if (!HEX_RE.test(hex)) return null
  }

  const lockedSet = new Set(
    (l || '')
      .split(',')
      .map(s => parseInt(s, 10))
      .filter(n => !Number.isNaN(n))
  )

  return parts.map((hex, i) => ({
    hex: `#${hex.toUpperCase()}`,
    locked: lockedSet.has(i + 1),
  }))
}

export function readPaletteFromURL() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return decodePalette(params.get('p'), params.get('l'))
}

export function writePaletteToURL(colors) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const { p, l } = encodePalette(colors)
  params.set('p', p)
  if (l) params.set('l', l)
  else params.delete('l')
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState(null, '', next)
}
