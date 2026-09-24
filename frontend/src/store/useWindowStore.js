import { create } from 'zustand';

export const useWindowStore = create((set, get) => ({
  windows: [],
  focusedWindowId: null,
  maxZIndex: 10,

  openApp: (app, customProps = {}) => {
    const { windows, maxZIndex } = get();
    const existing = windows.find((w) => w.appId === app.id);

    if (existing) {
      const nextZ = maxZIndex + 1;
      set({
        windows: windows.map((w) =>
          w.id === existing.id
            ? { ...w, minimized: false, zIndex: nextZ }
            : w
        ),
        focusedWindowId: existing.id,
        maxZIndex: nextZ,
      });
      return;
    }

    const nextZ = maxZIndex + 1;
    const windowWidth = app.defaultWidth || 560;
    const windowHeight = app.defaultHeight || 420;

    // Calculate cascading position or centered position
    const offset = (windows.length % 6) * 28;
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 900;

    const initialX = Math.max(40, Math.min(screenW - windowWidth - 60, Math.floor((screenW - windowWidth) / 2) + offset));
    const initialY = Math.max(40, Math.min(screenH - windowHeight - 120, Math.floor((screenH - windowHeight) / 2) - 30 + offset));

    const newWindow = {
      id: `${app.id}-${Date.now()}`,
      appId: app.id,
      title: app.name,
      x: initialX,
      y: initialY,
      width: windowWidth,
      height: windowHeight,
      prevBounds: null,
      zIndex: nextZ,
      minimized: false,
      maximized: false,
      ...customProps,
    };

    set({
      windows: [...windows, newWindow],
      focusedWindowId: newWindow.id,
      maxZIndex: nextZ,
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id);
      let nextFocused = state.focusedWindowId;
      if (nextFocused === id) {
        const topWindow = [...remaining]
          .filter((w) => !w.minimized)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        nextFocused = topWindow ? topWindow.id : null;
      }
      return {
        windows: remaining,
        focusedWindowId: nextFocused,
      };
    });
  },

  focusWindow: (id) => {
    const { windows, maxZIndex, focusedWindowId } = get();
    if (focusedWindowId === id) return;

    const target = windows.find((w) => w.id === id);
    if (!target) return;

    const nextZ = maxZIndex + 1;
    set({
      windows: windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZ, minimized: false } : w
      ),
      focusedWindowId: id,
      maxZIndex: nextZ,
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      );
      const topVisible = [...remaining]
        .filter((w) => !w.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      return {
        windows: remaining,
        focusedWindowId: topVisible ? topVisible.id : null,
      };
    });
  },

  toggleMaximize: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          // Restore previous dimensions
          return {
            ...w,
            maximized: false,
            x: w.prevBounds?.x ?? w.x,
            y: w.prevBounds?.y ?? w.y,
            width: w.prevBounds?.width ?? w.width,
            height: w.prevBounds?.height ?? w.height,
            prevBounds: null,
          };
        } else {
          // Save previous dimensions and maximize
          return {
            ...w,
            maximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          };
        }
      }),
    }));
  },

  moveWindow: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, x, y, maximized: false } : w
      ),
    }));
  },

  resizeWindow: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? {
              ...w,
              width: Math.max(300, width),
              height: Math.max(220, height),
              maximized: false,
            }
          : w
      ),
    }));
  },
}));
