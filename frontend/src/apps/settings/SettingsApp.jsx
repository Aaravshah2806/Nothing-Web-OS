import React, { useState } from 'react';
import { Palette, LayoutGrid, Info, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import styles from './SettingsApp.module.css';

const WALLPAPERS = [
  { id: 'dot-grid', name: 'DOT MATRIX GRID', previewClass: 'wallpaper-dot-grid' },
  { id: 'glyph-lines', name: 'GLYPH CIRCUIT', previewClass: 'wallpaper-glyph-lines' },
  { id: 'minimal-gradient', name: 'MINIMAL MONOCHROME', previewClass: 'wallpaper-minimal-gradient' },
];

const ACCENT_COLORS = [
  { id: '#FF3B30', name: 'Signal Red' },
  { id: '#FFD400', name: 'Industrial Yellow' },
  { id: '#FFFFFF', name: 'Glyph White' },
  { id: '#007AFF', name: 'Electric Blue' },
];

const AVAILABLE_WIDGETS = [
  { id: 'clock', name: 'Digital Clock Widget' },
  { id: 'glyph-status', name: 'Glyph Status LED Bar' },
  { id: 'notes-widget', name: 'Desktop Sticky Note' },
  { id: 'calendar', name: 'Month Calendar' },
  { id: 'weather', name: 'Weather Forecast' },
];

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState('personalization');

  const {
    wallpaper,
    setWallpaper,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    activeWidgets,
    toggleWidget,
  } = useDesktopStore();

  return (
    <div className={styles.container}>
      {/* Settings Navigation Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>SETTINGS</div>
        <button
          onClick={() => setActiveTab('personalization')}
          className={`${styles.tabBtn} ${activeTab === 'personalization' ? styles.activeTab : ''}`}
        >
          <Palette size={16} />
          <span>PERSONALIZATION</span>
        </button>
        <button
          onClick={() => setActiveTab('widgets')}
          className={`${styles.tabBtn} ${activeTab === 'widgets' ? styles.activeTab : ''}`}
        >
          <LayoutGrid size={16} />
          <span>WIDGETS</span>
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`${styles.tabBtn} ${activeTab === 'about' ? styles.activeTab : ''}`}
        >
          <Info size={16} />
          <span>ABOUT GLYPH OS</span>
        </button>
      </div>

      {/* Settings Main Content */}
      <div className={styles.content}>
        {activeTab === 'personalization' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>WALLPAPER SELECTION</h3>
            <div className={styles.wallpaperGrid}>
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.id}
                  onClick={() => setWallpaper(wp.id)}
                  className={`${styles.wallpaperCard} ${wallpaper === wp.id ? styles.activeCard : ''}`}
                >
                  <div className={`${styles.wallpaperPreview} ${wp.previewClass}`}>
                    {wallpaper === wp.id && (
                      <div className={styles.checkBadge}>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <span className={styles.wallpaperName}>{wp.name}</span>
                </div>
              ))}
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: '28px' }}>THEME MODE</h3>
            <div className={styles.themeSelector}>
              <button
                onClick={() => setTheme('dark')}
                className={`${styles.themeOption} ${theme === 'dark' ? styles.activeThemeOption : ''}`}
              >
                <Moon size={16} />
                <span>DARK MODE (DEFAULT)</span>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`${styles.themeOption} ${theme === 'light' ? styles.activeThemeOption : ''}`}
              >
                <Sun size={16} />
                <span>LIGHT MODE</span>
              </button>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: '28px' }}>ACCENT COLOR (SIGNAL)</h3>
            <div className={styles.accentGrid}>
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setAccentColor(col.id)}
                  className={`${styles.accentBtn} ${accentColor === col.id ? styles.activeAccentBtn : ''}`}
                >
                  <span className={styles.accentSwatch} style={{ backgroundColor: col.id }} />
                  <span>{col.name}</span>
                  {accentColor === col.id && <Check size={14} className={styles.accentCheck} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>DESKTOP WIDGET ENGINE</h3>
            <p className={styles.sectionSubtitle}>
              Toggle which widgets are displayed on the home desktop grid.
            </p>
            <div className={styles.widgetList}>
              {AVAILABLE_WIDGETS.map((w) => {
                const isEnabled = activeWidgets.some((item) => item.widgetId === w.id);
                return (
                  <div key={w.id} className={styles.widgetItem}>
                    <div>
                      <div className={styles.widgetItemName}>{w.name}</div>
                      <div className={styles.widgetItemTag}>Widget ID: {w.id}</div>
                    </div>
                    <button
                      onClick={() => toggleWidget(w.id)}
                      className={`${styles.toggleSwitch} ${isEnabled ? styles.toggleActive : ''}`}
                    >
                      <div className={styles.toggleKnob} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>GLYPH OS SPECIFICATIONS</h3>
            <div className={styles.aboutCard}>
              <div className={styles.aboutLogo}>GLYPH OS (1)</div>
              <p className={styles.aboutVersion}>Version 1.0.0 (Web Desktop Edition)</p>
              <div className={styles.specsTable}>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>DESIGN INSPIRATION</span>
                  <span className={styles.specVal}>Nothing OS Minimal Aesthetics</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>FRONTEND STACK</span>
                  <span className={styles.specVal}>React, Vite, Zustand, Vanilla CSS</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>TYPOGRAPHY</span>
                  <span className={styles.specVal}>DotGothic16 & Space Mono</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>BACKEND TIER</span>
                  <span className={styles.specVal}>Express.js REST API + Supabase Auth & Storage</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>TARGET VIEWPORT</span>
                  <span className={styles.specVal}>Laptop & Desktop (1280px+)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
