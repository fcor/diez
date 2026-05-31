const UNICODE = {
  tl: '┌', tr: '┐', bl: '└', br: '┘',
  h: '─', v: '│',
}

const ASCII = {
  tl: '+', tr: '+', bl: '+', br: '+',
  h: '-', v: '|',
}

// Change this to switch border style: 'unicode' | 'ascii'
const MODE = 'ascii'

export const BORDERS = MODE === 'ascii' ? ASCII : UNICODE
