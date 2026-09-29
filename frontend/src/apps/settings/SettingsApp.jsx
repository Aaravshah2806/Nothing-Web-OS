import React, { useState } from 'react';
import {
  Palette,
  LayoutGrid,
  Info,
  Check,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { playNotificationChime } from '../../lib/soundEngine';
import styles from './SettingsApp.module.css';

const WALLPAPERS = [
  { id: '4', name: 'NOTHING OS 2.0 DARK', image: '/wallpapers/4.png' },
  { id: '1', name: 'FLOWER X-RAY (OS 1)', image: '/wallpapers/1.png' },
  { id: '2', name: 'RED GLYPH CORE', image: '/wallpapers/2.png' },
  { id: '3', name: 'GLASS MECHANICAL', image: '/wallpapers/3.png' },
  { id: '5', name: 'RED SIGNAL MINIMAL', image: '/wallpapers/5.png' },
  { id: '6', name: 'PHONE (2A) RIBBON', image: '/wallpapers/6.png' },
  { id: '7', name: 'CIRCUIT WIREFRAME', image: '/wallpapers/7.png' },
  { id: '8', name: 'MONO DOT MATRIX', image: '/wallpapers/8.png' },
  { id: '9', name: 'DARK INDUSTRIAL', image: '/wallpapers/9.png' },
  { id: '10', name: 'PURE DARK GRID', image: '/wallpapers/10.png' },
  { id: 'dot-grid', name: 'PROCEDURAL DOTS', previewClass: 'wallpaper-dot-grid' },
  { id: 'glyph-lines', name: 'GLYPH CIRCUIT', previewClass: 'wallpaper-glyph-lines' },
  { id: 'minimal-gradient', name: 'MONO GRADIENT', previewClass: 'wallpaper-minimal-gradient' },
];

const ACCENT_COLORS = [
  { id: '#FF3B30', name: 'Signal Red' },
  { id: '#FFD400', name: 'Industrial Yellow' },
  { id: '#FFFFFF', name: 'Glyph White' },
  { id: '#007AFF', name: 'Electric Blue' },
  { id: '#00F0FF', name: 'Cyber Neon' },
  { id: '#30D158', name: 'Matrix Green' },
];

const AVAILABLE_WIDGETS = [
  { id: 'clock', name: 'NThing Dual-Tone Clock' },
  { id: 'date', name: 'NThing Date 2 Pill (Day Progress)' },
  { id: 'weather', name: 'NThing Weather 2 Pill' },
  { id: 'system-ram', name: 'NThing System Monitor (RAM/CPU/SSD)' },
  { id: 'music-widget', name: 'NThing Music Player Pill' },
  { id: 'quotes', name: 'NThing Thoughts & Quotes Card' },
  { id: 'glyph-status', name: 'Glyph Status LED Bar' },
  { id: 'notes-widget', name: 'Desktop Sticky Note' },
  { id: 'calendar', name: 'Month Calendar' },
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
    soundVolume,
    setSoundVolume,
    soundMuted,
    setSoundMuted,
    resetDesktopLayout,
    addNotification,
  } = useDesktopStore();

  const handleResetLayout = () => {
    resetDesktopLayout();
    addNotification({
      title: 'DESKTOP RESET',
      message: 'Restored widgets and desktop icons to default layout.',
    });
  };

  const handleTestSound = () => {
    playNotificationChime();
  };

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
          <span>WIDGETS & DESKTOP</span>
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
                  <div
                    className={`${styles.wallpaperPreview} ${wp.previewClass || ''}`}
                    style={
                      wp.image
                        ? {
                            backgroundImage: `url(${wp.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  >
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

            <h3 className={styles.sectionTitle} style={{ marginTop: '28px' }}>AUDIO & SOUND FEEDBACK</h3>
            <div className={styles.soundControlBox}>
              <div className={styles.soundRow}>
                <button
                  onClick={() => setSoundMuted(!soundMuted)}
                  className={styles.soundMuteBtn}
                  title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
                >
                  {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{soundMuted ? 'MUTED' : 'ENABLED'}</span>
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundMuted ? 0 : soundVolume}
                  onChange={(e) => {
                    if (soundMuted) setSoundMuted(false);
                    setSoundVolume(parseFloat(e.target.value));
                  }}
                  className={styles.soundSlider}
                />

                <span className={styles.soundVolumeVal}>{Math.round(soundVolume * 100)}%</span>

                <button onClick={handleTestSound} className={styles.testSoundBtn}>
                  TEST AUDIO
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>DESKTOP WIDGET ENGINE</h3>
            <p className={styles.sectionSubtitle}>
              Toggle which widgets are displayed on the home desktop grid. Widgets are freely draggable with 8px grid snapping.
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

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={handleResetLayout} className={styles.resetLayoutBtn}>
                <RotateCcw size={14} />
                <span>RESET DESKTOP & WIDGET LAYOUT TO DEFAULT</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>GLYPH OS SPECIFICATIONS</h3>
            <div className={styles.aboutCard}>
              <div className={styles.aboutLogo}>GLYPH OS (1)</div>
              <p className={styles.aboutVersion}>Version 1.2.0 (Web Desktop Workstation Edition)</p>
              <div className={styles.specsTable}>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>DESIGN INSPIRATION</span>
                  <span className={styles.specVal}>Nothing OS Minimal Aesthetics</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>FRONTEND STACK</span>
                  <span className={styles.specVal}>React 19, Vite 8, Zustand 5, Web Audio API</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>PRODUCTIVITY APPS</span>
                  <span className={styles.specVal}>Notes (Markdown), Focus Timer, Dictaphone, Dev Tools</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>HARDWARE SIMULATOR</span>
                  <span className={styles.specVal}>Interactive Glyph Matrix Composer & LED strip</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>AUDIO ENGINE</span>
                  <span className={styles.specVal}>Procedural Cyber Synth & Ambient Noise Generator</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>KEYBOARD SHORTCUTS</span>
                  <span className={styles.specVal}>Cmd/Ctrl+K (Spotlight), Alt+Arrows (Window Tiling)</span>
                </div>
                <div className={styles.specRow}>
                  <span className={styles.specKey}>PERSISTENCE</span>
                  <span className={styles.specVal}>Zustand LocalStorage Middleware + Supabase Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
