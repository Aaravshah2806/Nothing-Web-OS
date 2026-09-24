# Design Plan
## Project: "Glyph OS" — Nothing-Inspired Web Desktop OS (Laptop Format)

**Version:** 1.0
**Last updated:** 2026-09-24

> Note on originality: This design plan draws *stylistic inspiration* from Nothing's design language (dot-matrix type, monochrome + red accent, transparent/glyph aesthetic). It does not use Nothing's actual proprietary "Ndot"/"Ntype" fonts, glyph hardware assets, or logos. All fonts and icons below are open-source or original, styled to evoke the same feeling.

---

## 1. Design Philosophy

Four principles guide every screen:

1. **Monochrome first, red as signal.** Base palette is black/white/grey. Red (#FF3B30-family) is reserved for status, focus, and key actions only — never decorative.
2. **Dot-matrix as texture, not just type.** The "dotted" feel shows up in the font, in loading indicators, in the status glyph, and in subtle background grids — not just headline text.
3. **Transparency & layering.** Windows, dock, and notification panels use translucency (backdrop blur) to suggest the "see-through" quality of Nothing's hardware.
4. **Grid discipline.** Every layout — desktop, widgets, windows — snaps to an underlying 8px grid. Nothing floats arbitrarily.

---

## 2. Color System

### Dark theme (default)
| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#0A0A0A` | Desktop background base |
| `--surface-1` | `#141414` | Window/panel background |
| `--surface-2` | `#1E1E1E` | Raised elements (dock, cards) |
| `--border-subtle` | `#2A2A2A` | Hairline borders |
| `--text-primary` | `#F5F5F5` | Primary text |
| `--text-secondary` | `#8C8C8C` | Secondary/meta text |
| `--accent` | `#FF3B30` | Focus states, alerts, active glyph |
| `--accent-dim` | `#7A211C` | Hover/pressed accent |

### Light theme
| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#F5F5F5` | Desktop background |
| `--surface-1` | `#FFFFFF` | Window/panel background |
| `--surface-2` | `#EAEAEA` | Raised elements |
| `--border-subtle` | `#D8D8D8` | Hairline borders |
| `--text-primary` | `#0A0A0A` | Primary text |
| `--text-secondary` | `#6B6B6B` | Secondary text |
| `--accent` | `#FF3B30` | Same accent both themes |

Accent color is user-configurable in Settings but defaults to red; store as `--accent` CSS variable so swapping it re-themes the whole OS instantly.

---

## 3. Typography

Nothing's real "Ndot"/"Ntype" fonts are proprietary — use these open alternatives instead:

| Role | Font | Notes |
|---|---|---|
| Display / dot-matrix headings (clock widget, boot screen, window titles) | **"DotGothic16"** (Google Fonts) or **"Silkscreen"** (Google Fonts) | Genuine dot-matrix pixel look, free/open |
| Body / UI text | **"Space Mono"** or **"JetBrains Mono"** (Google Fonts) | Monospace, echoes Nothing's technical/utilitarian feel |
| Numerals (calculator, clock, battery-style glyph) | **"Digital Numbers"** or reuse **DotGothic16** | Consistent tabular-number look |

Type scale (base 16px, 8px grid-aligned line-heights):
- Display: 48 / 32 / 24px (DotGothic16 or Silkscreen)
- Body: 14 / 16px (Space Mono)
- Caption/meta: 12px (Space Mono, `--text-secondary`)

All fonts loaded via Google Fonts `<link>` or self-hosted `@font-face` for offline reliability.

---

## 4. Iconography

- App icons and dock icons: simple 2px-stroke line icons, monochrome, square 1:1 aspect, rounded-square container (matching Nothing's rounded-square app icon shape) — build custom SVGs or use a line-icon set like **Lucide** (open source, MIT) as a base and restyle stroke weight/color.
- System icons (wifi, battery, volume): rendered as small dot-matrix/pixel glyphs rather than smooth vector icons, for consistency with the dot-matrix theme.
- Window controls (close/minimize/maximize): minimal dot or line glyphs in a neutral grey, turning red only on hover for "close."

---

## 5. Layout — Laptop/Desktop Format

Target range: 1280px–2560px wide, 720px–1440px tall. No mobile/tablet breakpoints in V1 (show a "desktop only" notice below 1280px per PRD).

### 5.1 Desktop Canvas
- Full-viewport wallpaper (default: subtle black dot-grid pattern, faint white dots on `--bg-base`).
- Widget grid overlays the wallpaper; widgets are translucent cards (`--surface-1` at ~70% opacity + backdrop-blur).
- 24px safe margin from viewport edges for widget placement.

### 5.2 Dock (bottom-anchored)
- Height: 64px, centered horizontally, floating with 16px margin from bottom edge.
- Background: `--surface-2` at ~60% opacity, backdrop-blur(20px), 16px corner radius.
- Icons: 40×40px, 8px gap, active-app indicator = small red dot beneath icon.
- System tray (right-aligned segment within dock or separate small pill): clock (HH:MM in dot font), quick-settings icon.

### 5.3 Window Chrome
- Title bar height: 36px, `--surface-1`, bottom hairline border `--border-subtle`.
- Title text: Space Mono, 13px, `--text-secondary`, left-aligned with 12px padding.
- Window controls: right-aligned, 3 minimal glyphs (—, ▢, ×), 24×24px hit targets, close (×) turns `--accent` red on hover.
- Window body: `--surface-1`, 1px `--border-subtle` border, 12px corner radius, drop shadow `0 8px 32px rgba(0,0,0,0.4)`.
- Resize handles: 6px invisible hit area on edges/corners.

### 5.4 Notification Center
- Slides in from top-right, 360px wide, full-height panel, `--surface-1` at 85% opacity + blur.
- Each notification: dot-matrix timestamp, app icon, message, dismiss ×.

### 5.5 Spotlight Search
- Centered modal overlay, 600px wide, appears on `Cmd/Ctrl+K`.
- Large input field (Space Mono, 18px), dot-matrix placeholder text "Search apps, notes...".
- Results list below with app/note icons and keyboard-navigable highlight (`--accent` outline on selected row).

---

## 6. Widget Specs

| Widget | Default size (grid units) | Key visual notes |
|---|---|---|
| Clock | 2×1 | Large DotGothic16 time display, small date caption below |
| Weather | 2×2 | Temp in dot font, condition icon (custom pixel-style), location text |
| Music Player | 3×1 | Album art thumbnail (square, rounded 8px), title/artist marquee if overflow, play/pause/skip glyph buttons |
| Notes | 2×2 | Sticky-note style, user-selectable accent color per note, small dot-matrix "last edited" timestamp |
| Calendar | 3×2 | Month grid, current day highlighted with `--accent` filled dot |
| Glyph Status | 4×1 (thin bar) | Horizontal strip of segmented dot indicators representing simulated "system status" (decorative, inspired by Nothing's rear glyph lights — implemented as animated CSS dot segments, not a literal hardware reproduction) |

All widgets share: 12px corner radius, `--surface-1` background at 70% opacity, 1px `--border-subtle` border, consistent 16px internal padding.

---

## 7. Motion & Animation

- **Boot sequence:** dot-matrix logo builds up dot-by-dot (staggered opacity/scale animation, ~1.2s), then fades to lock screen.
- **Window open/close:** scale from 0.96→1 with opacity fade, 180ms ease-out.
- **Dock hover:** icon scale to 1.15 with a subtle upward translate (macOS-like but restrained — no bounce).
- **Glyph status widget:** looping subtle pulse across segments (like a heartbeat/loading bar), 2–3s loop, low-key, non-distracting.
- **Notification enter/exit:** slide + fade, 220ms.
- Respect `prefers-reduced-motion`: disable non-essential animations (glyph pulse, dock bounce) when set.

---

## 8. Wallpapers

Default set (V1), all generated/original (not photographs of Nothing hardware):
1. **Dot Grid** — faint white dots on near-black, subtle vignette.
2. **Glyph Lines** — thin red/white line segments arranged like a circuit/glyph pattern on black.
3. **Minimal Gradient** — soft black-to-charcoal radial gradient, no texture, for users who want calm.

Users can also upload their own wallpaper (stored in Supabase Storage `wallpapers` bucket).

---

## 9. Accessibility

- Minimum contrast ratio 4.5:1 for body text against surfaces (verify dot-matrix display font legibility at small sizes — use it only for numerals/short labels, never long paragraphs).
- All interactive elements (dock icons, window controls, widget buttons) have visible focus rings (`--accent` outline, 2px) for keyboard navigation.
- Spotlight search and window switching support full keyboard operation (arrow keys + Enter).
- `prefers-reduced-motion` respected as noted in §7.
- `prefers-color-scheme` can inform default theme choice, overridable in Settings.

---

## 10. Design Tokens File (starting point)

```css
:root {
  /* Color - dark theme default */
  --bg-base: #0A0A0A;
  --surface-1: #141414;
  --surface-2: #1E1E1E;
  --border-subtle: #2A2A2A;
  --text-primary: #F5F5F5;
  --text-secondary: #8C8C8C;
  --accent: #FF3B30;
  --accent-dim: #7A211C;

  /* Spacing (8px grid) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* Typography */
  --font-display: 'DotGothic16', monospace;
  --font-body: 'Space Mono', monospace;

  /* Elevation */
  --shadow-window: 0 8px 32px rgba(0,0,0,0.4);
}

[data-theme="light"] {
  --bg-base: #F5F5F5;
  --surface-1: #FFFFFF;
  --surface-2: #EAEAEA;
  --border-subtle: #D8D8D8;
  --text-primary: #0A0A0A;
  --text-secondary: #6B6B6B;
}
```
