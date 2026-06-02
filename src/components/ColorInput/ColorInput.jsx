import { useState, useEffect, useCallback } from 'react'
import { usePaletteDispatch } from '../../context/PaletteContext'
import { HARMONY_NAMES } from '../../utils/color'
import styles from './ColorInput.module.css'

const HEX_RE = /^#[0-9a-f]{6}$/i

function ColorInput({ onOpenAbout }) {
  const dispatch = usePaletteDispatch()
  const [value, setValue] = useState('')
  const [harmony, setHarmony] = useState('triadic')

  function handleSubmit(e) {
    e.preventDefault()
    const hex = value.startsWith('#') ? value : `#${value}`
    if (!HEX_RE.test(hex)) return
    dispatch({ type: 'ADD_COLOR', hex: hex.toUpperCase() })
    setValue('')
  }

  const handleShuffle = useCallback(() => {
    dispatch({ type: 'SHUFFLE', rule: harmony })
  }, [dispatch, harmony])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code !== 'Space') return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      e.preventDefault()
      handleShuffle()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleShuffle])

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <span className={styles.prompt}>&gt;</span>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="#000000"
          maxLength={7}
        />
        <button className={styles.button} type="submit">
          [+ add]
        </button>
      </form>

      <div className={styles.shuffle}>
        <span className={styles.harmonyLabel}>harmony:</span>
        <div className={styles.rules}>
          {HARMONY_NAMES.map(name => (
            <button
              key={name}
              className={`${styles.rule} ${harmony === name ? styles.ruleActive : ''}`}
              onClick={() => setHarmony(name)}
            >
              {harmony === name ? `(*) ${name}` : `( ) ${name}`}
            </button>
          ))}
        </div>
        <button className={styles.shuffleBtn} onClick={handleShuffle}>
          [ SHUFFLE ]
        </button>
        {onOpenAbout && (
          <button className={styles.aboutBtn} onClick={onOpenAbout}>
            [ ABOUT ]
          </button>
        )}
      </div>
    </>
  )
}

export default ColorInput
