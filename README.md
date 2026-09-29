# GLYPH OS (1)

> An authentic, web-based desktop operating system inspired by Nothing OS's design language — dot-matrix typography, monochrome surfaces, signal red accents, and transparent glyph hardware aesthetics.

![Glyph OS Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80)

---

## ⚡ Overview

**Glyph OS (1)** is a high-performance, browser-native desktop workstation engineered for laptops and desktop viewports (1280px+). Designed with strict 8px grid discipline, frosted glassmorphism, and real procedural Web Audio synthesis, it combines the iconic industrial aesthetic of Nothing hardware with a suite of genuinely useful everyday productivity applications.

---

## 🚀 Key Features & Built-In Applications

### 1. 🎛️ Hardware Glyph Composer & Matrix Simulator (`GLYPH LAB`)
- **Authentic Nothing Phone Backplate:** Accurate geometric simulation of the Dual Camera Ring, Red Recording LED, Diagonal Slash, Central Wireless Charging Coil (C-arc), and Bottom Battery Exclamation Point.
- **Dynamic Lighting Modes:**
  - *Breathing Pulse:* Smooth harmonic glow.
  - *Glyph Heartbeat:* Double-pulse cardiac sequence.
  - *Orbital Sweep:* Clockwise rotational sequence.
  - *Metronome Strobe:* High-tempo stroboscopic flashing.
  - *Battery Telemetry:* Real-time battery status visualized along the exclamation strip via the Battery Status API.
- **Interactive Light Composer:** Click individual LED segments to compose custom lighting routines with synchronized procedural audio tones.

### 2. ⏳ Focus / Pomodoro Glyph Timer (`FOCUS TIMER`)
- **Productivity Intervals:** 25-minute Pomodoro, 50-minute Deep Work, 15-minute Sprint, and customizable break timers.
- **Glyph Circular Countdown Dial:** 24-segment LED dial that drains in real time as your session progresses.
- **Procedural Ambient Focus Sound:** Synthesizes warm rain noise, vinyl static, or clockwork ticks using the Web Audio API without external audio files.
- **Audio Alarm & Notifications:** Notifies you on session completion and logs daily finished sessions.

### 3. 🎙️ Dictaphone Voice Memo Recorder (`RECORDER`)
- **Analog Tape Reel Deck:** Dual spinning cassette tape reels with tape film animation.
- **Live Waveform Display:** Real-time microphone audio visualizer rendered onto an HTML5 canvas via `AudioContext` and `AnalyserNode`.
- **Browser-Native MediaRecorder:** Capture real voice memos, play back with scrubber controls, or download as `.webm` audio files.

### 4. 🛠️ Developer & Power Utilities (`DEV TOOLS`)
- **JSON Formatter & Validator:** Prettify with 2-space indentation or minify JSON with syntax error detection.
- **Base64 Converter:** Instant two-way conversion of text strings and tokens.
- **SHA-256 Hash & UUID Generator:** Compute cryptographic hashes using `crypto.subtle` and generate random v4 UUIDs.
- **Case Converter:** Convert between camelCase, snake_case, kebab-case, UPPERCASE, and dot.case.

### 5. 📝 Notes App & Live Desktop Widget
- **Markdown Support:** Toggle between raw markdown and a formatted dot-matrix reader with headings, blockquotes, bullet points, and interactive checklist items (`- [x]`).
- **File Export:** Download any note as `.md` directly to your local computer.
- **Bidirectional Desktop Sync:** Edits made in the Notes app automatically reflect in the home screen Quick Note widget and vice versa.

### 6. 🎵 Cyber-Synth & Local Music Player (`MUSIC`)
- **Procedural Ambient Groove Synthesizer:** Real synthesized electronic lo-fi beats (kick, hi-hat, chords, and arpeggios) generated live through the Web Audio API.
- **Local Audio Upload:** Drag and drop or import any `.mp3`, `.wav`, or `.ogg` file from your computer for instant native playback.
- **Dynamic LED Equalizer:** Reactive 12-band audio equalizer display.

### 7. 💻 Virtual Terminal (`TERMINAL`)
- Simulated command shell with history (Up/Down arrows):
  - `glyphfetch` / `neofetch`: Hardware and OS telemetry readout.
  - `matrix`: Dot-matrix rain animation.
  - `open <app>`: Launch apps via CLI.
  - `theme <dark|light>`, `accent <hex>`, `wallpaper <name>`, `calc <expr>`, `ls`, `cat`, etc.

### 8. 🪟 Advanced Window Manager & Desktop Ergonomics
- **8-Directional Window Resizing:** Drag any edge or corner with pointer capture.
- **Aero Edge Snapping:** Drag windows to screen edges for split-screen tiling (left half, right half, or maximize).
- **Keyboard Window Tiling:** `Alt + Left/Right/Up/Down` to tile, maximize, and minimize windows instantly.
- **Alt + Tab Task Switcher:** Visual task switcher overlay for rapid app cycling.
- **Draggable Desktop Icons:** Desktop icons snap to the 8px grid and retain their custom positions across sessions.

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd / Ctrl + K` | Toggle Spotlight App Search |
| `Alt + Arrow Left` | Snap active window to Left Half (50% split) |
| `Alt + Arrow Right` | Snap active window to Right Half (50% split) |
| `Alt + Arrow Up` | Maximize / Restore active window |
| `Alt + Arrow Down` | Minimize / Restore active window |
| `Alt + Tab` | Open Task Switcher & cycle through open windows |
| `Escape` | Dismiss modals, Spotlight, and context menus |

---

## 🛠️ Architecture & Tech Stack

```
Nothing-Web-OS/
├── docs/                 # PRD, TRD, and Design Plan specifications
└── frontend/
    ├── src/
    │   ├── apps/         # Self-contained OS applications
    │   │   ├── glyph/        # Hardware Glyph Composer & Simulator
    │   │   ├── pomodoro/     # Focus Timer & Ambient Audio
    │   │   ├── recorder/     # Dictaphone Voice Memo Recorder
    │   │   ├── devtools/     # JSON, Base64, Hash & Case utilities
    │   │   ├── notes/        # Markdown Notes with local file export
    │   │   ├── music/        # Web Audio Synth & MP3 Player
    │   │   ├── files/        # File Manager
    │   │   ├── calculator/   # LED Dot-matrix Calculator
    │   │   ├── gallery/      # Image Archive
    │   │   ├── terminal/     # Virtual Shell
    │   │   └── settings/     # Personalization & System Controls
    │   ├── os/           # Desktop environment & window manager
    │   │   ├── desktop/      # Canvas, icon grid, widget layout, marquee
    │   │   ├── dock/         # Dock pill, active dots, System Tray
    │   │   ├── window-manager# 8-way resize, Aero snap, Alt-Tab
    │   │   ├── spotlight/    # Search overlay
    │   │   ├── boot/         # Lock screen & boot sequence
    │   │   └── notifications/# Toast notification drawer
```
Nothing-Web-OS/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB connection & reconnect handler
│   │   ├── models/       # Mongoose Schemas (User, DesktopState, Note, VoiceMemo)
│   │   ├── controllers/  # Auth, Desktop state, Notes, Recorder, Telemetry, Weather
│   │   ├── routes/       # Express REST endpoints
│   │   ├── middleware/   # JWT verification & DB status gatekeeper
│   │   └── server.js     # Express server entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    └── src/
        ├── apps/         # Applications (Glyph Lab, Focus Timer, Recorder, Dev Tools, Notes, etc.)
        ├── os/           # Window manager, dock, taskbar, spotlight, lock screen
        ├── widgets/      # Desktop widgets (Clock, Glyph Status, Weather, Notes, Calendar)
        ├── store/        # Zustand stores with localStorage persistence
        ├── lib/          # Web Audio procedural sound engine & API client
        └── styles/       # Design tokens (tokens.css, global.css)
```

- **Frontend:** React 19, Vite 8, Zustand 5 (with `persist` middleware).
- **Backend:** Node.js, Express.js, Mongoose.
- **Database:** MongoDB (Local or MongoDB Atlas Free Tier).
- **Styling:** Modular Vanilla CSS & CSS Custom Properties (zero CSS framework bloat).
- **Typography:** `DotGothic16`, `Silkscreen`, `Space Mono`.
- **Sound:** Web Audio API procedural sound synthesis (tactile clicks, timer alarm, notification pings, ambient focus noise).

---

## 🏁 Getting Started

### 1. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`. Ensure your viewport is 1280px wide or greater.

### 2. Start the Backend & MongoDB
```bash
cd backend
npm install
npm run dev
```
The backend server runs at `http://localhost:5000`.

#### MongoDB Setup (Choose Local or Cloud Atlas)
- **Local MongoDB (Default):**
  Ensure MongoDB service is running (`mongodb://localhost:27017/nothing_web_os`).
- **Free MongoDB Atlas Cloud:**
  1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  2. In `backend/.env`, set your connection string:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/nothing_web_os?retryWrites=true&w=majority
     ```
  *Note:* Even if MongoDB is offline, the backend continues running in offline-first mode to serve live system telemetry and weather proxying!

## 🎨 NThing-UI Integration

This project integrates visual assets, fonts, wallpapers, and widget designs from [NThing-UI](https://github.com/Runixe786/NThing-UI) by **Sahil / MaybeSahil / Runixe786**:
- **Authentic Nothing Typography:** Official `NDot55`, `Nothing5x7`, `NType82`, `NTypeMono`, `NThingE1/E2`, and `NothingDate` fonts.
- **10 Official High-Res Nothing Wallpapers:** Extracted from NThing-UI (X-Ray, Red Glyph Core, Glass Mechanical, Dark OS 2.0, Ribbon 2a, Circuit Wireframe, and more).
- **Authentic Dot-Matrix Weather Icons:** 48 authentic Nothing dot-matrix weather icons with dynamic WMO weather code mapping.
- **NThing Widget Suite:**
  - *NThing Dual-Tone Clock Widget:* Red hour accent, blinking colon, and dot-matrix date badges.
  - *NThing Date 2 Pill Widget:* Circular 24-hour day progress pie ring (`MeterDayPie`), Buick date typography, and uppercase month/day.
  - *NThing Weather 2 Pill Widget:* Frosted pill with circular frame housing dot-matrix weather icons and live temperature.
  - *NThing Monitor Pill Widget:* Circular radial percentage gauge for RAM, CPU, SSD, and Battery with live telemetry.
  - *NThing Music Player Pill Widget:* Spinning vinyl disc, track info, progress bar, play/pause controls, and dynamic equalizer bars.
  - *NThing Quotes & Facts Widget:* Nothing manifesto & design philosophy cards with cycling thoughts.
- **NThing Start Menu & Power Menu:** Dock Start Button, searchable pinned app launcher with authentic monochrome app icons, system telemetry bar, and quick power controls (Sleep, Lock, Restart, Shut Down).

---

## 📜 License & Acknowledgments

- This project is an open-source educational concept inspired by the visual design language of **Nothing Technology Limited**.
- Special thanks to [Runixe786/NThing-UI](https://github.com/Runixe786/NThing-UI) for providing the authentic Rainmeter Nothing OS assets, wallpapers, fonts, and widget layouts.
