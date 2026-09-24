# Product Requirements Document (PRD)
## Project: "Glyph OS" — A Nothing-Inspired Web Desktop OS (Laptop Format)

**Version:** 1.0
**Status:** Draft
**Owner:** [Your name]
**Last updated:** 2026-09-24

---

## 1. Overview

Glyph OS is a web-based desktop operating system experience inspired by Nothing OS's design language — dot-matrix typography, monochrome black/white surfaces with a red accent, transparent "glyph" UI elements, and a minimal, grid-driven interface. It runs entirely in the browser, targeting **laptop/desktop screen sizes only** (not a mobile OS simulation).

The product is a personal productivity shell: a home screen with widgets, a dock/taskbar, draggable app windows, and a small suite of built-in apps (Notes, Calculator, Music Player, Gallery, Settings, File Manager), all skinned in the Nothing-inspired visual system.

This is **not** an attempt to reproduce Nothing's proprietary OS, fonts, or glyph interface assets — it is an original web OS that borrows stylistic inspiration only.

---

## 2. Goals & Objectives

- Deliver a visually distinctive, self-contained "web OS" that runs at `/` in any modern browser, optimized for 1280px+ viewports (laptop/desktop).
- Provide a working window manager (open, close, minimize, maximize, drag, resize, focus/z-index).
- Ship a home screen with a customizable widget grid (clock, weather, music, notes, calendar, "battery/status glyph").
- Ship a dock/taskbar with pinned + running app icons.
- Persist user state (layout, widgets, notes, settings, wallpaper, theme) via Supabase, tied to an authenticated user.
- Establish a clean 3-tier architecture: React frontend, Express REST API, Supabase (Postgres + Auth + Storage).

## 3. Non-Goals (V1)

- No real mobile/responsive phone-sized layout — laptop format only.
- No actual telephony, SMS, or OS-level hardware access (this is a web app, not a real OS).
- No true multi-user collaboration (single user per account, no shared desktops).
- No offline-first / PWA support in V1 (may be a later phase).
- No cloning of Nothing's actual proprietary fonts, glyph matrix hardware effects, or trademarked assets.

---

## 4. Target Users

- Personal portfolio / "cool desktop" project for developers who like Nothing's design language.
- Users who want a personalized "start page" / dashboard replacing a browser new-tab page.
- Design-focused users who want a themeable widget dashboard.

---

## 5. Key Features (Scope)

### 5.1 Boot / Lock Screen
- Animated boot sequence (dot-matrix logo reveal, minimal loading glyph animation).
- Lock screen with clock, date, and a "swipe/click to unlock" interaction (mouse-driven, not touch).
- Login via Supabase Auth (email/password + optional OAuth provider, e.g. Google).

### 5.2 Home Screen (Desktop)
- Full-screen canvas with a wallpaper (default: Nothing-style transparent/dot grid wallpaper).
- Widget grid, freely draggable/repositionable, snap-to-grid.
- Right-click context menu (change wallpaper, add widget, refresh, open settings).

### 5.3 Widgets (V1 set)
| Widget | Description |
|---|---|
| Clock | Large dot-matrix digital clock + date |
| Weather | Current temp/condition (via a weather API call proxied through Express) |
| Music Player | Mini player with play/pause/skip, album art, progress bar |
| Notes | Quick sticky-note widget, syncs to Supabase `notes` table |
| Calendar | Month view, current date highlighted |
| Glyph Status | Stylized "glyph interface" bar showing battery-style/system status (decorative, since it's a browser) |

### 5.4 Dock / Taskbar
- Bottom-anchored dock with pinned app icons.
- Running apps show an active indicator (dot).
- Click to open/focus/minimize.
- System tray area: clock, quick settings (theme toggle, volume, wifi icon — decorative/simulated where no real hardware access exists).

### 5.5 Window Manager
- Draggable, resizable app windows with a consistent Nothing-style title bar (dot-matrix window title, minimize/maximize/close controls using simple glyph icons, not colored macOS-style dots).
- Focus/z-index management (click to bring to front).
- Snap-to-edge (half-screen, quarter-screen) resizing.
- Minimize to dock, restore from dock.

### 5.6 Built-in Apps (V1)
- **Notes** — create/edit/delete notes, persisted to Supabase.
- **Calculator** — basic arithmetic, styled with dot-matrix digit display.
- **Gallery** — grid of user-uploaded images (Supabase Storage).
- **Music Player** — playlist UI (can be static/demo data in V1, or user-uploaded via Storage).
- **Settings** — wallpaper picker, theme (dark/light + accent color), font size, widget management, account/profile, sign out.
- **File Manager (basic)** — lists files from Supabase Storage bucket, upload/delete.

### 5.7 App Launcher / Spotlight Search
- Keyboard shortcut (e.g. `Cmd/Ctrl + K`) opens a centered search overlay to launch apps or search notes/files.

### 5.8 Notification Center
- Slide-in panel (from top-right) showing simulated/system notifications (e.g. "Note saved", "Wallpaper changed").

---

## 6. User Stories

1. As a user, I can log in and see my personalized desktop with my saved wallpaper and widget layout.
2. As a user, I can drag widgets around the home screen and have their positions persist across sessions.
3. As a user, I can open the Notes app, write a note, and see it saved automatically.
4. As a user, I can open multiple app windows, move them around, and switch focus between them.
5. As a user, I can change the theme/accent color and font in Settings and see it apply instantly across the OS.
6. As a user, I can upload an image and set it as my wallpaper.
7. As a user, I can search for an app or a note using a keyboard shortcut.

---

## 7. Success Metrics (for a personal/portfolio project)

- All V1 features functional end-to-end (auth → desktop → widgets → apps → persistence).
- Desktop layout, widget state, and settings persist correctly across page reloads and logins.
- No layout breakage between 1280px and 1920px+ widths (laptop range).
- Lighthouse performance score > 85 on the home screen.

---

## 8. Assumptions & Constraints

- Laptop/desktop format only — no dedicated mobile layout is required in V1 (a "not supported on mobile" splash screen is acceptable).
- Real Nothing OS fonts ("Ndot", "Ntype") are proprietary; V1 uses open alternatives styled to match the dot-matrix look (see Design Plan for specifics).
- Weather/music data may be mocked or use free-tier third-party APIs.
- Single-tenant per user account; no shared/multiplayer desktops in V1.

---

## 9. Phased Roadmap

**Phase 1 — MVP**
- Auth (Supabase), boot/lock screen, home screen shell, dock, window manager, Settings, Notes widget + app, Clock + Calendar widgets, wallpaper picker.

**Phase 2**
- Weather widget (live API), Music player (real playback), Gallery + File Manager, Notification Center, Spotlight search.

**Phase 3**
- Widget marketplace/custom widget builder, multiple desktop "spaces" (virtual desktops), theming presets, export/import desktop config.

---

## 10. Open Questions

- Which weather API/provider (rate limits, key management via Express backend)?
- Should music playback support real audio files (Supabase Storage) or just a mocked UI in V1?
- OAuth providers beyond email/password (Google only, or more)?
