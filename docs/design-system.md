# ColorPalette — Design System

Source: `src/design-system.css`

## Philosophy

Everything on screen is built from monospace characters. The design system
enforces a terminal-instrument aesthetic where the only color comes from the
palette being worked on — all chrome is neutral.

Tokens are CSS custom properties so the entire look can be re-themed by
changing a few values.

---

## Token Reference

### Font

| Token            | Default                                  | Purpose                |
|------------------|------------------------------------------|------------------------|
| `--font-mono`    | `"SF Mono", "Menlo", "Consolas", mono..` | Typeface (swap here)   |
| `--font-size`    | `14px`                                   | Base size              |
| `--line-height`  | `1.4`                                    | Base line height       |

### Character Cell

All spacing derives from the character cell — the rectangle one monospace
glyph occupies.

| Token      | Value                                    | Purpose             |
|------------|------------------------------------------|----------------------|
| `--cell-w` | `1ch`                                    | Cell width           |
| `--cell-h` | `calc(var(--font-size) * var(--line-height))` | Cell height     |

### Surfaces (backgrounds)

Three-layer depth system:

```
 ┌──────────────────────────────────┐
 │  elevated  #1f2029  (modals,     │
 │  ┌────────────────────────────┐  │  popups, tooltips)
 │  │  secondary  #1a1b26        │  │  (panels)
 │  │  ┌──────────────────────┐  │  │
 │  │  │  primary  #16161e    │  │  │  (page background)
 │  │  └──────────────────────┘  │  │
 │  └────────────────────────────┘  │
 └──────────────────────────────────┘
```

| Token            | Value     | Use                        |
|------------------|-----------|----------------------------|
| `--bg-primary`   | `#16161e` | Page background            |
| `--bg-secondary` | `#1a1b26` | Panels                     |
| `--bg-elevated`  | `#1f2029` | Modals, popups, tooltips   |

### Foreground (text)

Three-tier hierarchy:

```
  --fg-primary    #c0caf5   ████  Active content, values, data
  --fg-secondary  #565f89   ████  Chrome, borders, labels
  --fg-muted      #3b3f52   ████  Decorative lines, disabled
```

### Accent

| Token          | Value     | Use                          |
|----------------|-----------|------------------------------|
| `--accent`     | `#7aa2f7` | Interactive elements         |
| `--accent-dim` | `#3d59a1` | Hover states, subtle hl      |

### Feedback

| Token             | Value     | Use      |
|-------------------|-----------|----------|
| `--color-warning` | `#e0af68` | Warnings |
| `--color-error`   | `#f7768e` | Errors   |
| `--color-success` | `#9ece6a` | Success  |

### Box-Drawing Characters

Default set uses Unicode. Add `data-borders="ascii"` to `<html>` for fallback.

```
  Unicode (default)          ASCII fallback
  ┌──────┐                   +------+
  │      │                   |      |
  ├──────┤                   +------+
  │      │                   |      |
  └──────┘                   +------+
```

| Token              | Unicode | ASCII |
|--------------------|---------|-------|
| `--border-tl`      | `┌`     | `+`   |
| `--border-tr`      | `┐`     | `+`   |
| `--border-bl`      | `└`     | `+`   |
| `--border-br`      | `┘`     | `+`   |
| `--border-h`       | `─`     | `-`   |
| `--border-v`       | `│`     | `\|`  |
| `--border-cross`   | `┼`     | `+`   |
| `--border-t-down`  | `┬`     | `+`   |
| `--border-t-up`    | `┴`     | `+`   |
| `--border-t-right` | `├`     | `+`   |
| `--border-t-left`  | `┤`     | `+`   |

### Block Characters

Used for palette swatches, gradients, and the generative canvas.

```
  ░  --block-light    25% fill
  ▒  --block-medium   50% fill
  ▓  --block-heavy    75% fill
  █  --block-full    100% fill
```

Luminance-driven interpolation across palette stops:
```
  ░░░░▒▒▒▒▓▓▓▓████████▓▓▓▓▒▒▒▒░░░░
```

### Density Ramp

For ASCII art rendering where block characters aren't appropriate:

```
  --density-ramp: " .:-=+*#%@"
   light ──────────────> heavy
```

### Spacing

Horizontal spacing in `ch` (character widths):

| Token      | Value  |
|------------|--------|
| `--space-1` | `1ch` |
| `--space-2` | `2ch` |
| `--space-3` | `3ch` |
| `--space-4` | `4ch` |
| `--space-8` | `8ch` |

Vertical spacing in line-heights:

| Token       | Value          |
|-------------|----------------|
| `--vspace-1` | 1 line height |
| `--vspace-2` | 2 line heights|
| `--vspace-3` | 3 line heights|

### Component Tokens

| Token               | Value                | Purpose                     |
|----------------------|----------------------|-----------------------------|
| `--panel-border-color` | `var(--fg-secondary)` | Panel border color        |
| `--panel-header-color` | `var(--fg-primary)`   | Panel header text         |
| `--panel-bg`         | `var(--bg-secondary)` | Panel background            |
| `--button-fg`        | `var(--fg-primary)`   | Button text                 |
| `--button-bracket`   | `var(--fg-secondary)` | Button brackets `[ ]`       |
| `--button-hover-fg`  | `var(--accent)`       | Button hover text           |
| `--input-fg`         | `var(--fg-primary)`   | Input text                  |
| `--input-border`     | `var(--fg-secondary)` | Input border                |
| `--selection-marker` | `*`                  | Radio/checkbox active marker|

---

## TUI Widget Conventions

```
  Buttons:     [ EXPORT ]  [ OK ]  [ CANCEL ]
  Radio:       (*) selected   ( ) unselected
  Checkbox:    [x] enabled    [ ] disabled
  Prompt:      > add color_
  Section:     / PALETTE /
  Separator:   ────────────────────────────
  Inline tag:  [ GUIDED 2 ]  (Cogmind-style)
```

---

## Theming

To re-theme the app, override the surface/foreground/accent variables.
The entire UI will adapt because component tokens reference these roots.

To swap fonts, change `--font-mono`. All spacing recalculates automatically
since it's based on `ch` and `line-height` units.

To use ASCII borders, set `data-borders="ascii"` on `<html>`.
