import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { playTactileClick, playSnapChime, playCloseChime } from '../lib/soundEngine';

export const useWindowStore = create(
  persist(
    (set, get) => ({
      windows: [],
      focusedWindowId: null,
      maxZIndex: 10,
      snapPreview: null, // { active: true, type: 'left' | 'right' | 'top' }
      altTabOpen: false,
      altTabSelectedIdx: 0,

      setSnapPreview: (preview) => set({ snapPreview: preview }),

      openApp: (app, customProps = {}) => {
        playTactileClick();
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
          snapState: 'none', // 'none' | 'left' | 'right'
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
        playCloseChime();
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

        playTactileClick();
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
        playTactileClick();
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
        playTactileClick();
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            if (w.maximized || w.snapState !== 'none') {
              return {
                ...w,
                maximized: false,
                snapState: 'none',
                x: w.prevBounds?.x ?? w.x,
                y: w.prevBounds?.y ?? w.y,
                width: w.prevBounds?.width ?? w.width,
                height: w.prevBounds?.height ?? w.height,
                prevBounds: null,
              };
            } else {
              return {
                ...w,
                maximized: true,
                snapState: 'none',
                prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
              };
            }
          }),
        }));
      },

      snapWindow: (id, snapType) => {
        playSnapChime();
        set((state) => ({
          windows: state.windows.map((w) => {
            if (w.id !== id) return w;
            if (snapType === 'top') {
              return {
                ...w,
                maximized: true,
                snapState: 'none',
                prevBounds: w.prevBounds || { x: w.x, y: w.y, width: w.width, height: w.height },
              };
            }
            if (snapType === 'left' || snapType === 'right') {
              return {
                ...w,
                maximized: false,
                snapState: snapType,
                prevBounds: w.prevBounds || { x: w.x, y: w.y, width: w.width, height: w.height },
              };
            }
            return {
              ...w,
              snapState: 'none',
              maximized: false,
            };
          }),
          snapPreview: null,
        }));
      },

      tileFocusedWindow: (direction) => {
        const { focusedWindowId, windows, toggleMaximize, snapWindow, minimizeWindow } = get();
        if (!focusedWindowId) return;
        const current = windows.find((w) => w.id === focusedWindowId);
        if (!current) return;

        if (direction === 'left') {
          snapWindow(focusedWindowId, 'left');
        } else if (direction === 'right') {
          snapWindow(focusedWindowId, 'right');
        } else if (direction === 'up') {
          if (!current.maximized) {
            toggleMaximize(focusedWindowId);
          }
        } else if (direction === 'down') {
          if (current.maximized || current.snapState !== 'none') {
            toggleMaximize(focusedWindowId);
          } else {
            minimizeWindow(focusedWindowId);
          }
        }
      },

      moveWindow: (id, x, y) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  x,
                  y,
                  maximized: false,
                  snapState: 'none',
                }
              : w
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
                  snapState: 'none',
                }
              : w
          ),
        }));
      },

      resizeWindowDir: (id, { x, y, width, height }) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  x: x !== undefined ? x : w.x,
                  y: y !== undefined ? y : w.y,
                  width: width !== undefined ? Math.max(300, width) : w.width,
                  height: height !== undefined ? Math.max(220, height) : w.height,
                  maximized: false,
                  snapState: 'none',
                }
              : w
          ),
        }));
      },

      // Alt + Tab Task Switcher
      openAltTab: () => {
        const { windows } = get();
        if (windows.length === 0) return;
        set({ altTabOpen: true, altTabSelectedIdx: (get().altTabSelectedIdx + 1) % windows.length });
      },

      cycleAltTab: (forward = true) => {
        const { windows, altTabSelectedIdx } = get();
        if (windows.length === 0) return;
        const nextIdx = forward
          ? (altTabSelectedIdx + 1) % windows.length
          : (altTabSelectedIdx - 1 + windows.length) % windows.length;
        set({ altTabSelectedIdx: nextIdx });
      },

      commitAltTab: () => {
        const { windows, altTabSelectedIdx, focusWindow } = get();
        if (windows[altTabSelectedIdx]) {
          focusWindow(windows[altTabSelectedIdx].id);
        }
        set({ altTabOpen: false });
      },

      cancelAltTab: () => set({ altTabOpen: false }),
    }),
    {
      name: 'glyph_os_window_state',
      partialize: (state) => ({
        windows: state.windows,
        focusedWindowId: state.focusedWindowId,
        maxZIndex: state.maxZIndex,
      }),
    }
  )
);
