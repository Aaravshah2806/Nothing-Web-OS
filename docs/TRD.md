# Technical Requirements Document (TRD)
## Project: "Glyph OS" — Nothing-Inspired Web Desktop OS

**Version:** 1.0
**Status:** Draft
**Last updated:** 2026-09-24

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (JavaScript, not TypeScript), Vite as build tool |
| Styling | CSS Modules / plain CSS with CSS variables (design tokens) — Tailwind optional if preferred |
| State Management | Zustand (lightweight, good fit for window manager + widget state) |
| Backend | Express.js (Node.js), REST API |
| Database / Auth / Storage | Supabase (Postgres, Supabase Auth, Supabase Storage) |
| Realtime (optional, Phase 2+) | Supabase Realtime channels (for live widget sync across tabs) |
| Deployment | Frontend: Vercel/Netlify. Backend: Render/Railway/Fly.io. DB: Supabase Cloud |

**Why Express in front of Supabase, instead of calling Supabase directly from React?**
Supabase can be called directly from the frontend using its JS client and Row Level Security (RLS). We still add an Express layer for:
- Proxying third-party API calls that need a secret key (e.g. weather API) so the key never reaches the browser.
- Centralizing business logic that shouldn't live in the client (e.g. validation, rate limiting, future integrations).
- A clean seam if you later add non-Supabase services.

Direct Supabase calls from React (via `@supabase/supabase-js`) are still used for simple CRUD (notes, settings, widget layout) protected by RLS — this avoids unnecessary round-trips through Express for basic data operations. Express is reserved for: auth-adjacent server logic, third-party API proxying, and any endpoint needing a service-role key.

---

## 2. High-Level Architecture

```
┌──────────────────────────┐
│        Browser            │
│  React SPA (Vite)         │
│  - Window Manager          │
│  - Widget Engine           │
│  - App Registry            │
└───────────┬───────────────┘
            │ HTTPS (JWT from Supabase Auth)
            │
   ┌────────┴─────────┐
   │                   │
   ▼                   ▼
┌───────────────┐   ┌─────────────────────┐
│ Supabase       │   │ Express API          │
│ - Auth         │   │ - /api/weather        │
│ - Postgres DB  │   │ - /api/proxy/*        │
│ - Storage      │   │ - Uses service role   │
│ - RLS policies │   │   key for privileged   │
└───────────────┘   │   Supabase ops         │
                     └─────────────────────┘
```

Frontend talks to Supabase directly for user-scoped CRUD (protected by RLS using the user's JWT). Frontend talks to Express for anything needing a secret (weather API key, service-role Supabase actions like admin cleanup jobs).

---

## 3. Frontend Architecture

### 3.1 Folder Structure

```
/frontend
  /src
    /app
      App.jsx
      routes.jsx
    /os
      /window-manager
        WindowManager.jsx
        Window.jsx
        useWindowStore.js        (Zustand store: open windows, z-index, position)
      /dock
        Dock.jsx
        DockIcon.jsx
      /desktop
        Desktop.jsx
        WidgetGrid.jsx
      /boot
        BootScreen.jsx
        LockScreen.jsx
      /notifications
        NotificationCenter.jsx
      /spotlight
        SpotlightSearch.jsx
    /widgets
      /clock
      /weather
      /music-player
      /notes-widget
      /calendar
      /glyph-status
      widgetRegistry.js          (maps widget id -> component + default size)
    /apps
      /notes-app
      /calculator
      /gallery
      /music-player-app
      /settings
      /file-manager
      appRegistry.js              (maps app id -> icon, component, default window size)
    /lib
      supabaseClient.js
      apiClient.js                 (fetch wrapper for Express endpoints)
    /store
      useDesktopStore.js           (wallpaper, theme, layout)
      useAuthStore.js
    /styles
      tokens.css                    (design tokens: color, type, spacing)
      global.css
    /assets
      /fonts
      /icons
      /wallpapers
    main.jsx
  index.html
  vite.config.js
```

### 3.2 Window Manager State Shape (Zustand)

```js
{
  windows: [
    {
      id: "notes-1699999",
      appId: "notes",
      title: "Notes",
      x: 120, y: 80, width: 480, height: 360,
      zIndex: 3,
      minimized: false,
      maximized: false,
    }
  ],
  focusedWindowId: "notes-1699999",
  openApp(appId, initialProps) {},
  closeWindow(windowId) {},
  focusWindow(windowId) {},
  moveWindow(windowId, x, y) {},
  resizeWindow(windowId, w, h) {},
  minimizeWindow(windowId) {},
  toggleMaximize(windowId) {},
}
```

### 3.3 Widget Engine

Each widget is a self-contained React component registered in `widgetRegistry.js` with metadata: `{ id, name, defaultSize: {w,h}, component, minSize, maxSize }`. `WidgetGrid.jsx` renders widgets based on the user's saved layout (fetched from Supabase `desktop_layout` table), using a simple grid/drag library (e.g. `react-grid-layout` or a hand-rolled drag handler using pointer events).

### 3.4 Routing

Single-page app; no traditional multi-route navigation needed beyond:
- `/` — boot/lock/desktop (state-driven, not route-driven)
- `/auth` — login/signup (if not using a modal)

App "windows" are not routes — they are in-memory UI state managed by the window manager, so refreshing the page returns to the desktop (optionally restoring last open windows from local/session state or Supabase).

---

## 4. Backend Architecture (Express)

### 4.1 Folder Structure

```
/backend
  /src
    server.js
    /routes
      weather.routes.js
      admin.routes.js
    /controllers
      weather.controller.js
    /services
      supabaseAdmin.js        (service-role client, server-side only)
      weatherProvider.js
    /middleware
      auth.middleware.js       (verifies Supabase JWT on protected routes)
      errorHandler.js
    /config
      env.js
  package.json
  .env
```

### 4.2 Environment Variables (Backend)

```
PORT=4000
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...     # server-only, never exposed to frontend
WEATHER_API_KEY=...
CORS_ORIGIN=http://localhost:5173
```

### 4.3 API Endpoints (V1)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/health` | Health check | none |
| GET | `/api/weather?lat=&lon=` | Proxy weather API call | Required (JWT) |
| POST | `/api/uploads/signed-url` | Get a signed upload URL for Storage (if not done client-side) | Required |
| POST | `/api/admin/cleanup` | Example privileged/service-role action | Required + admin check |

Most CRUD (notes, widget layout, settings, files metadata) goes **directly from React to Supabase** via `supabase-js`, governed by RLS — it does not need to pass through Express.

### 4.4 Auth Middleware

Express verifies the Supabase-issued JWT on protected routes by validating it against Supabase's JWKS/secret, extracting `user.id` for use in privileged operations.

---

## 5. Database Schema (Supabase / Postgres)

```sql
-- Users are managed by Supabase Auth (auth.users)

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

create table public.desktop_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  wallpaper_url text,
  theme text default 'dark',        -- 'dark' | 'light'
  accent_color text default '#FF3B30',
  font_scale numeric default 1.0,
  updated_at timestamptz default now()
);

create table public.desktop_layout (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  widget_id text not null,          -- e.g. 'clock', 'weather'
  x integer, y integer, w integer, h integer,
  config jsonb default '{}',        -- widget-specific settings
  updated_at timestamptz default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content text,
  color text default '#FFD400',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  storage_path text not null,
  file_name text,
  mime_type text,
  created_at timestamptz default now()
);
```

### 5.1 Row Level Security (RLS)

Enable RLS on all user-owned tables; policy pattern:

```sql
alter table public.notes enable row level security;

create policy "Users can CRUD their own notes"
on public.notes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

Repeat equivalent policies for `desktop_settings`, `desktop_layout`, `files`, `profiles`.

### 5.2 Storage Buckets

- `wallpapers` (public read, authenticated write to own folder `user_id/...`)
- `gallery` (private, per-user folder, signed URLs)
- `music` (private, per-user folder, signed URLs) — Phase 2

---

## 6. Authentication Flow

1. User signs up/logs in via `supabase.auth.signUp` / `signInWithPassword` (or OAuth) from the React app.
2. Supabase returns a session with a JWT; `supabase-js` persists it (localStorage) and auto-refreshes.
3. Frontend uses the same Supabase client for direct DB calls (RLS enforces ownership).
4. For Express calls, frontend sends `Authorization: Bearer <access_token>`; Express middleware verifies it before proceeding.

---

## 7. Non-Functional Requirements

- **Performance:** Widget re-renders should be isolated (memoized) so dragging one widget doesn't re-render the whole desktop. Window drag/resize should use `requestAnimationFrame`-based updates, not per-pixel React state churn.
- **Security:** Service-role Supabase key lives only in the Express `.env`, never shipped to the client. All user data access from the client goes through RLS-protected tables.
- **Browser support:** Latest Chrome, Edge, Firefox, Safari (desktop). No IE/legacy support.
- **Minimum viewport:** 1280×720. Below that, show a "please use a larger screen" notice (per PRD, laptop-only).
- **Error handling:** Global error boundary in React for app-window crashes (an app crash shouldn't take down the whole desktop — isolate per-window error boundaries).

---

## 8. Deployment

- **Frontend:** Vite build → static hosting (Vercel/Netlify). Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`.
- **Backend:** Node/Express deployed to Render/Railway/Fly.io. Env vars as listed in §4.2.
- **Database:** Supabase Cloud project (managed Postgres + Auth + Storage).
- **CORS:** Express restricts `CORS_ORIGIN` to the deployed frontend domain.

---

## 9. Testing Strategy

- Unit tests: Zustand store logic (window manager actions), utility functions (date/weather formatting).
- Component tests: React Testing Library for widgets and window chrome (open/close/drag behavior mocked).
- API tests: Supertest against Express routes (mock Supabase admin client).
- Manual QA checklist: multi-window drag/focus/z-index, persistence after reload, RLS isolation (user A cannot see user B's notes).
