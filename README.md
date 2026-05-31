```
███████ ██ ██████ ███████
███████ ██ ██████ ███████
██   ██ ██ ██         ███
██   ██ ██ █████    ███
██   ██ ██ ██     ███
███████ ██ ██████ ███████
███████ ██ ██████ ███████
   colors → code → art
```

# Diez

A small palette tool for creative coding. Build a palette, watch it animate
on a generative canvas, copy it out as CSS / GLSL / p5.js.

Named after [Carlos Cruz-Diez](https://en.wikipedia.org/wiki/Carlos_Cruz-Diez),
the Venezuelan kinetic artist who spent his life on color interaction.
His *Physichromies* are the reason this project exists.

## What it does

- **Build** — manual hex, locked slots, harmony shuffles (complementary,
  triadic, analogous, split). Spacebar to reroll unlocked colors.
- **See** — live p5.js canvas with a few algorithms (matrix rain, value
  noise, Cruz-Diez vertical strips, recursive grid). The palette drives
  it in real time.
- **Export** — CSS custom properties, GLSL `vec3` uniforms, or a p5.js
  array. One click to copy.

## Look & feel

ASCII / TUI throughout. Box-drawing borders, monospace everything, the
only color on screen is the palette you're working on.

## Stack

Vite + React, [culori](https://culorijs.org/) for OKLCH color math,
[p5.js](https://p5js.org/) for the canvas.

## Run it

```bash
npm install
npm run dev
```
