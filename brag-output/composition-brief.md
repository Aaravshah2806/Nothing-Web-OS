# Hyperframes Composition Brief: GLYPH OS (1)

## Objective
Create a short, polished, high-contrast launch-style brag video for GLYPH OS (1).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20 seconds (600 frames @ 30fps)

## Source Material
- Project root: `d:\Projects\Nothing-Web-OS`
- Primary files read: `README.md`, `frontend/index.html`, `frontend/src/styles/tokens.css`, `frontend/src/styles/global.css`, `frontend/src/apps/glyph/GlyphApp.jsx`
- Product name: GLYPH OS (1)
- Tagline / strongest claim: "An authentic Nothing OS desktop in your browser — complete with real procedural Web Audio synth beats and an interactive LED Glyph Matrix simulator."
- Key UI or visual moment to recreate:
  - The transparent Nothing Phone backplate with illuminated LED glyph paths (Camera rings, Slash, Central C-coil, Exclamation mark).
  - Dot-matrix typography and frosted glass windows (`Focus Timer` LED countdown dial & `Tape Recorder` dual spinning reels).
  - Floating frosted glass Dock with Nothing-style icons.
- Copy that must appear verbatim:
  - "NOTHING OS. IN YOUR BROWSER."
  - "GLYPH MATRIX (1) // BREATHING PULSE"
  - "8PX GRID DISCIPLINE // PROCEDURAL AUDIO"
  - "TECH MADE TACTILE AGAIN."
  - "GLYPH OS (1)"

## Creative Direction
- Tone preset: `polished`
- Creative direction: "Sleek industrial hardware launch meets cyber-minimalist web OS"
- Interpretation: Deep monochrome backgrounds (`#0A0A0A`), crisp dot-matrix displays, glowing white glyph LEDs, and piercing Signal Red (`#FF3B30`) accents. High-contrast, tactile, mechanical timing.
- Angle: Showcase the browser OS as if it were a physical piece of iconic consumer hardware engineered by Nothing.
- Hook: A single pulsing red recording LED on pitch black that detonates into the full Glyph light bar array on the beat drop.
- Outro / punchline: "TECH MADE TACTILE AGAIN." -> "GLYPH OS (1) — READY TO BOOT."
- Avoid:
  - Generic SaaS language ("Boost your productivity", "Streamline workflows")
  - Abstract 3D sphere filler or unrelated neon gradients
  - Blurry fonts or non-monochrome palettes

## Visual Identity
- Background: `#0A0A0A`
- Surface: `rgba(20, 20, 20, 0.85)` / `#141414`
- Border: `rgba(255, 255, 255, 0.15)`
- Accent: `#FF3B30` (Signal Red) with `rgba(255, 59, 48, 0.35)` glow
- Text Primary: `#F5F5F5`
- Text Secondary: `#8C8C8C`
- Display font: `DotGothic16`, `NDot55`, monospace
- Body font: `Space Mono`, monospace
- Visual references from the project:
  - 24-segment LED dial from Focus Timer
  - Dual cassette reels from Voice Recorder
  - Dot matrix clock & system telemetry widget
  - Hardware backplate with transparent internal traces

## Storyboard
1. **The Spark (0.0s - 3.5s)**: Pitch black frame. Red LED indicator blinks. Dot-matrix headline "NOTHING OS. IN YOUR BROWSER." At 3.02s beat drop, full white glyph backplate strikes with electric flash.
2. **Hardware Glyph Lab (3.5s - 8.5s)**: Close-up of transparent backplate. Sequential LED illumination across the dual camera ring, diagonal slash, central C-arc coil, and battery exclamation point. Telemetry text overlay.
3. **The Desktop Workstation (8.5s - 14.5s)**: Smooth transition to the multi-window desktop. Left window: Focus Timer with glowing circular LED countdown segments. Right window: Analog Voice Recorder with spinning cassette reels and reactive audio visualizer. Floating frosted dock below.
4. **The Outro & Punchline (14.5s - 20.0s)**: High-impact typography: "TECH MADE TACTILE AGAIN." Red glyph icon locks into place. Final logo "GLYPH OS (1)" with subtitle "DESKTOP WEB OS // OPEN SOURCE".

## Audio
- Audio role: Punchy electronic lo-fi groove with sharp mechanical interface clicks
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
- Music treatment: Starts at 0s, builds smoothly, full beat hit at 3.02s, maintains high energy, gentle fade out during outro.
- Music cue guidance: Key beats at 3.02s, 8.02s, 13.01s, 17.02s, 20.02s.
- Audio-coupled moments:
  - 0.5s: Mechanical click on red LED ignite
  - 3.02s: Bass drop on Glyph flash
  - 6.0s: Tactile clicks on LED segment rotation
  - 9.0s: Aero window snap sound
  - 17.02s: Impact hit on final punchline
- Exact SFX choice: Use clean tactile interface clicks and hits from `assets/sfx/interface/` and `assets/sfx/impact/`.

## Hyperframes Instructions
Use Hyperframes standard HTML/CSS composition structure in `brag-output/composition/`.
Run `npx hyperframes check` to validate before rendering to `brag-output/brag.mp4`.
Ensure WCAG contrast standards are strictly met (white `#F5F5F5` on `#0A0A0A` has >18:1 contrast ratio, signal red `#FF3B30` has vibrant visibility).
All assets are local.
