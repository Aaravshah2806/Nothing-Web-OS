# ( · ) Nothing Web OS Backend & MongoDB Engine

Production REST API and MongoDB persistence layer powering the Nothing Web OS desktop experience.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
The `.env` file is pre-configured with local defaults:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nothing_web_os
JWT_SECRET=glyph_os_super_secret_jwt_key_2026_nothing_dot_matrix
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Choose your MongoDB Option

#### Option A: Local MongoDB (Default)
If you have MongoDB installed on your computer:
- Ensure the MongoDB service is running (or start it via `mongod` or MongoDB Compass).
- The default URI is `mongodb://localhost:27017/nothing_web_os`.

#### Option B: Free Cloud MongoDB Atlas (Recommended if you don't have local MongoDB)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free M0 cluster (512MB free forever).
2. Create a database user (e.g. `nothing_admin` and a password).
3. Under **Network Access**, allow IP `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect** > **Drivers** and copy your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/nothing_web_os?retryWrites=true&w=majority
   ```
5. Paste it into `backend/.env`.

### 4. Run the Server
```bash
# Development mode with auto-reload:
npm run dev

# Production mode:
npm start
```

---

## 📡 API Endpoints

### 🩺 System & Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status, MongoDB connection, uptime |
| `GET` | `/api/system/telemetry` | Live hardware CPU, RAM, OS specs |
| `GET` | `/api/weather?city=Delhi` | Cached Open-Meteo weather proxy (zero API keys needed) |

### 🔐 Authentication
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | `{ username, email, password }` | Register new user + init default desktop state |
| `POST` | `/api/auth/login` | `{ email, password }` | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | *Bearer Token* | Get current authenticated profile |

### 🖥️ Desktop State (Auto-Sync)
| Method | Endpoint | Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/desktop/state` | *Bearer Token* | Load saved widgets, icons, wallpaper, volume |
| `PUT` | `/api/desktop/state` | `{ activeWidgets, desktopIcons, theme, ... }` | Save updated layout to MongoDB |

### 📝 Notes & Sharing
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/notes` | Get all user notes (sorted by pinned) |
| `POST` | `/api/notes` | Create a new note |
| `PUT` | `/api/notes/:id` | Update note content or title |
| `DELETE` | `/api/notes/:id` | Remove note |
| `POST` | `/api/notes/:id/share` | Toggle public sharing link |
| `GET` | `/api/notes/share/:slug` | **Public** view shared note by unique slug |

### 🎙️ Voice Recorder Memos
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recorder` | List user voice recordings |
| `POST` | `/api/recorder` | Save audio memo (base64 WebM format) |
| `GET` | `/api/recorder/:id` | Stream audio memo payload |
| `DELETE` | `/api/recorder/:id` | Delete voice memo |
