import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setMasterVolume, setSoundMuted, playNotificationChime } from '../lib/soundEngine';

const DEFAULT_ACTIVE_WIDGETS = [
  { id: 'w-clock', widgetId: 'clock', x: 36, y: 36 },
  { id: 'w-date', widgetId: 'date', x: 260, y: 36 },
  { id: 'w-weather', widgetId: 'weather', x: 470, y: 36 },
  { id: 'w-ram', widgetId: 'system-ram', x: 680, y: 36 },
  { id: 'w-music', widgetId: 'music-widget', x: 36, y: 160 },
  { id: 'w-glyph', widgetId: 'glyph-status', x: 360, y: 160 },
  { id: 'w-quotes', widgetId: 'quotes', x: 680, y: 160 },
];

const DEFAULT_DESKTOP_ICONS = [
  { id: 'icon-files', name: 'FILES', iconKey: 'Folder', imageIcon: '/icons/nthing/explorer.png', appId: 'files', x: 28, y: 480 },
  { id: 'icon-terminal', name: 'TERMINAL', iconKey: 'Terminal', imageIcon: '/icons/nthing/cmd.png', appId: 'terminal', x: 28, y: 580 },
  { id: 'icon-notes', name: 'NOTES', iconKey: 'FileText', imageIcon: '/icons/nthing/notepad.png', appId: 'notes', x: 120, y: 480 },
  { id: 'icon-glyph', name: 'GLYPH LAB', iconKey: 'Zap', imageIcon: '/icons/nthing/widgets1.png', appId: 'glyph', x: 120, y: 580 },
  { id: 'icon-pomodoro', name: 'FOCUS TIMER', iconKey: 'Timer', imageIcon: '/icons/nthing/widgets3.png', appId: 'pomodoro', x: 212, y: 480 },
  { id: 'icon-recorder', name: 'RECORDER', iconKey: 'Mic', imageIcon: '/icons/nthing/widgets2.png', appId: 'recorder', x: 212, y: 580 },
  { id: 'icon-devtools', name: 'DEV TOOLS', iconKey: 'Code', imageIcon: '/icons/nthing/vsc.png', appId: 'devtools', x: 304, y: 480 },
  { id: 'icon-ai', name: 'GLYPH AI', iconKey: 'Sparkles', imageIcon: '/icons/nthing/gemini.png', appId: 'assistant', x: 304, y: 580 },
  { id: 'icon-music', name: 'MUSIC', iconKey: 'Music', imageIcon: '/icons/nthing/spotify.png', appId: 'music', x: 396, y: 480 },
  { id: 'icon-trash', name: 'TRASH', iconKey: 'Trash2', imageIcon: '/icons/nthing/bin.png', appId: 'files', x: 396, y: 580 },
];

export const useDesktopStore = create(
  persist(
    (set) => ({
      wallpaper: '4', // Default to authentic high-res Nothing OS 2.0 wallpaper from NThing-UI
      theme: 'dark',
      accentColor: '#FF3B30',
      isLocked: false,
      isBooting: false,
      spotlightOpen: false,
      startMenuOpen: false,
      quickSettingsOpen: false,
      notificationCenterOpen: false,
      desktopContextMenu: { visible: false, x: 0, y: 0 },

      // Audio Preferences
      soundVolume: 0.8,
      soundMuted: false,

      // Glyph Hardware Simulator State
      glyphMode: 'pulse', // 'pulse' | 'torch' | 'music' | 'battery' | 'strobe'
      glyphBrightness: 1.0,

      // Quick note sync
      quickNote: 'Nothing Design Manifesto:\n1. Monochrome first, red as signal.\n2. Dot-matrix texture & clean geometry.\n3. Transparent hardware layering.',

      activeWidgets: DEFAULT_ACTIVE_WIDGETS,
      desktopIcons: DEFAULT_DESKTOP_ICONS,

      notifications: [
        {
          id: 'notif-welcome',
          title: 'GLYPH OS (1)',
          message: 'System loaded successfully. Press Ctrl+K for Spotlight search.',
          time: 'Just now',
        },
      ],

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setLocked: (isLocked) => set({ isLocked }),
      setBooting: (isBooting) => set({ isBooting }),

      setSoundVolume: (volume) => {
        const clamped = Math.max(0, Math.min(1, volume));
        setMasterVolume(clamped);
        set({ soundVolume: clamped });
      },

      setSoundMuted: (muted) => {
        setSoundMuted(muted);
        set({ soundMuted: Boolean(muted) });
      },

      setGlyphMode: (glyphMode) => set({ glyphMode }),
      setGlyphBrightness: (glyphBrightness) => set({ glyphBrightness }),

      setQuickNote: (quickNote) => set({ quickNote }),

      toggleSpotlight: () => set((state) => ({ spotlightOpen: !state.spotlightOpen })),
      setSpotlightOpen: (open) => set({ spotlightOpen: open }),

      toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
      setStartMenuOpen: (open) => set({ startMenuOpen: open }),

      toggleQuickSettings: () => set((state) => ({ quickSettingsOpen: !state.quickSettingsOpen })),
      setQuickSettingsOpen: (open) => set({ quickSettingsOpen: open }),

      toggleNotificationCenter: () => set((state) => ({ notificationCenterOpen: !state.notificationCenterOpen })),
      setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),

      openContextMenu: (x, y) => set({ desktopContextMenu: { visible: true, x, y } }),
      closeContextMenu: () => set({ desktopContextMenu: { visible: false, x: 0, y: 0 } }),

      addNotification: (notif) => {
        playNotificationChime();
        set((state) => ({
          notifications: [
            {
              id: `notif-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              ...notif,
            },
            ...state.notifications,
          ],
        }));
      },

      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAllNotifications: () => set({ notifications: [] }),

      updateWidgetPosition: (id, x, y) =>
        set((state) => ({
          activeWidgets: state.activeWidgets.map((w) =>
            w.id === id ? { ...w, x, y } : w
          ),
        })),

      toggleWidget: (widgetId) =>
        set((state) => {
          const exists = state.activeWidgets.find((w) => w.widgetId === widgetId);
          if (exists) {
            return { activeWidgets: state.activeWidgets.filter((w) => w.widgetId !== widgetId) };
          } else {
            return {
              activeWidgets: [
                ...state.activeWidgets,
                { id: `w-${widgetId}-${Date.now()}`, widgetId, x: 100, y: 100 },
              ],
            };
          }
        }),

      updateDesktopIconPosition: (id, x, y) =>
        set((state) => ({
          desktopIcons: state.desktopIcons.map((icon) =>
            icon.id === id ? { ...icon, x, y } : icon
          ),
        })),

      resetDesktopLayout: () =>
        set({
          activeWidgets: DEFAULT_ACTIVE_WIDGETS,
          desktopIcons: DEFAULT_DESKTOP_ICONS,
        }),
    }),
    {
      name: 'glyph_os_desktop_state',
      partialize: (state) => ({
        wallpaper: state.wallpaper,
        theme: state.theme,
        accentColor: state.accentColor,
        activeWidgets: state.activeWidgets,
        desktopIcons: state.desktopIcons,
        soundVolume: state.soundVolume,
        soundMuted: state.soundMuted,
        glyphMode: state.glyphMode,
        glyphBrightness: state.glyphBrightness,
        quickNote: state.quickNote,
      }),
    }
  )
);
