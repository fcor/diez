import { createContext, useContext, useEffect, useReducer } from 'react'
import { generateHarmony } from '../utils/color'
import { readPaletteFromURL, writePaletteToURL } from '../utils/url'

let nextId = 1

const DEFAULT_COLORS = [
  { hex: '#FC0FC0', locked: false },
  { hex: '#B600B6', locked: false },
  { hex: '#8A2BE2', locked: false },
  { hex: '#FF69B4', locked: false },
]

function withIds(colors) {
  return colors.map(c => ({ ...c, id: nextId++ }))
}

function initColors() {
  const fromURL = readPaletteFromURL()
  return withIds(fromURL ?? DEFAULT_COLORS)
}

function paletteReducer(state, action) {
  switch (action.type) {
    case 'ADD_COLOR':
      return [...state, { id: nextId++, hex: action.hex, locked: false }]

    case 'REMOVE_COLOR':
      return state.filter(c => c.id !== action.id)

    case 'UPDATE_COLOR':
      return state.map(c =>
        c.id === action.id ? { ...c, hex: action.hex } : c
      )

    case 'TOGGLE_LOCK':
      return state.map(c =>
        c.id === action.id ? { ...c, locked: !c.locked } : c
      )

    case 'SHUFFLE': {
      const locked = state.filter(c => c.locked)
      const unlocked = state.filter(c => !c.locked)
      const anchor = locked.length > 0 ? locked[0].hex : null
      const newHexes = generateHarmony(action.rule, unlocked.length, anchor)
      let hi = 0
      return state.map(c =>
        c.locked ? c : { ...c, hex: newHexes[hi++] }
      )
    }

    case 'REORDER': {
      const { fromIndex, toIndex } = action
      const next = [...state]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    }

    default:
      return state
  }
}

const PaletteContext = createContext(null)
const PaletteDispatchContext = createContext(null)

export function PaletteProvider({ children }) {
  const [colors, dispatch] = useReducer(paletteReducer, null, initColors)

  useEffect(() => {
    writePaletteToURL(colors)
  }, [colors])

  return (
    <PaletteContext.Provider value={colors}>
      <PaletteDispatchContext.Provider value={dispatch}>
        {children}
      </PaletteDispatchContext.Provider>
    </PaletteContext.Provider>
  )
}

export function usePalette() {
  return useContext(PaletteContext)
}

export function usePaletteDispatch() {
  return useContext(PaletteDispatchContext)
}
