import { create } from 'zustand';

export const useDesktopStore = create((set) => ({
  wallpaper: 'dot-grid',
  theme: 'dark',
  accentColor: '#FF3B30',
  isLocked: false,
  isBooting: false,
  spotlightOpen: false,
  quickSettingsOpen: false,
  notificationCenterOpen: false,
  desktopContextMenu: { visible: false, x: 0, y: 0 },

  activeWidgets: [
    { id: 'w-clock', widgetId: 'clock', x: 36, y: 36 },
    { id: 'w-glyph', widgetId: 'glyph-status', x: 36, y: 220 },
    { id: 'w-notes', widgetId: 'notes-widget', x: 36, y: 330 },
    { id: 'w-calendar', widgetId: 'calendar', x: 380, y: 36 },
    { id: 'w-weather', widgetId: 'weather', x: 380, y: 270 },
  ],

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

  toggleSpotlight: () => set((state) => ({ spotlightOpen: !state.spotlightOpen })),
  setSpotlightOpen: (open) => set({ spotlightOpen: open }),

  toggleQuickSettings: () => set((state) => ({ quickSettingsOpen: !state.quickSettingsOpen })),
  setQuickSettingsOpen: (open) => set({ quickSettingsOpen: open }),

  toggleNotificationCenter: () => set((state) => ({ notificationCenterOpen: !state.notificationCenterOpen })),
  setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),

  openContextMenu: (x, y) => set({ desktopContextMenu: { visible: true, x, y } }),
  closeContextMenu: () => set({ desktopContextMenu: { visible: false, x: 0, y: 0 } }),

  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ...notif,
        },
        ...state.notifications,
      ],
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

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
}));
