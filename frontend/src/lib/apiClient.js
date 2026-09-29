const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'glyph_os_auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `API error (${res.status})`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // If backend is not running or network fails
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn(`[GLYPH API] Backend unreachable at ${API_BASE}. Running in offline-first mode.`);
    }
    throw err;
  }
};

export const api = {
  // System & Health
  health: () => request('/health'),
  telemetry: () => request('/system/telemetry'),
  weather: (city = 'Delhi') => request(`/weather?city=${encodeURIComponent(city)}`),

  // Authentication
  auth: {
    register: (username, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request('/auth/me'),
    logout: () => {
      removeToken();
    },
    isLoggedIn: () => Boolean(getToken()),
  },

  // Desktop State Persistence
  desktop: {
    getState: () => request('/desktop/state'),
    updateState: (state) =>
      request('/desktop/state', {
        method: 'PUT',
        body: JSON.stringify(state),
      }),
  },

  // Notes
  notes: {
    list: () => request('/notes'),
    create: (note) =>
      request('/notes', {
        method: 'POST',
        body: JSON.stringify(note),
      }),
    update: (id, note) =>
      request(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note),
      }),
    delete: (id) =>
      request(`/notes/${id}`, {
        method: 'DELETE',
      }),
    toggleShare: (id) =>
      request(`/notes/${id}/share`, {
        method: 'POST',
      }),
    getShared: (slug) => request(`/notes/share/${slug}`),
  },

  // Voice Memos
  recorder: {
    list: () => request('/recorder'),
    getAudio: (id) => request(`/recorder/${id}`),
    save: (memo) =>
      request('/recorder', {
        method: 'POST',
        body: JSON.stringify(memo),
      }),
    delete: (id) =>
      request(`/recorder/${id}`, {
        method: 'DELETE',
      }),
  },

  // AI Assistant (Glyph AI)
  ai: {
    chat: (message, history = []) =>
      request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
      }),
    history: () => request('/ai/history'),
    clearHistory: () =>
      request('/ai/history', {
        method: 'DELETE',
      }),
  },
};
