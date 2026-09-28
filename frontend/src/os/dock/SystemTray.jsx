import React, { useState, useEffect } from 'react';
import { Sliders, Bell, Wifi, BatteryCharging, Moon, Sun, Monitor, Lock, Volume2, VolumeX } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import styles from './SystemTray.module.css';

export default function SystemTray() {
  const [time, setTime] = useState(new Date());

  const {
    quickSettingsOpen,
    toggleQuickSettings,
    toggleNotificationCenter,
    notifications,
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    setLocked,
    soundVolume,
    setSoundVolume,
    soundMuted,
    setSoundMuted,
  } = useDesktopStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');

  return (
    <div className={styles.systemTray}>
      {/* Tray status icons */}
      <div className={styles.iconsCluster}>
        <button
          onClick={toggleNotificationCenter}
          className={styles.trayIconBtn}
          title="Notification Center"
        >
          <Bell size={14} />
          {notifications.length > 0 && <span className={styles.notifBadge} />}
        </button>

        <span className={styles.trayStaticIcon} title="WiFi: Connected (Glyph-Net)">
          <Wifi size={14} />
        </span>

        <span className={styles.trayStaticIcon} title="Battery: 96% (Charging)">
          <BatteryCharging size={14} className={styles.accentColor} />
        </span>

        <button
          onClick={toggleQuickSettings}
          className={`${styles.trayIconBtn} ${quickSettingsOpen ? styles.activeTrayBtn : ''}`}
          title="Quick Settings"
        >
          <Sliders size={14} />
        </button>
      </div>

      {/* Clock Pill */}
      <div className={styles.clockPill} onClick={toggleQuickSettings} title="Click to view Quick Settings">
        <span className={styles.clockText}>{hours}:{minutes}</span>
      </div>

      {/* Quick Settings Dropdown Flyout */}
      {quickSettingsOpen && (
        <div className={styles.flyout} onClick={(e) => e.stopPropagation()}>
          <div className={styles.flyoutHeader}>
            <span className={styles.flyoutTitle}>CONTROL CENTER</span>
            <span className={styles.batteryStatus}>96% • AC POWER</span>
          </div>

          <div className={styles.quickGrid}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`${styles.quickTile} ${theme === 'dark' ? styles.quickTileActive : ''}`}
            >
              {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'dark' ? 'DARK THEME' : 'LIGHT THEME'}</span>
            </button>

            <button
              onClick={() =>
                setWallpaper(
                  wallpaper === 'dot-grid'
                    ? 'glyph-lines'
                    : wallpaper === 'glyph-lines'
                    ? 'minimal-gradient'
                    : 'dot-grid'
                )
              }
              className={styles.quickTile}
            >
              <Monitor size={16} />
              <span>CYCLE WALLPAPER</span>
            </button>
          </div>

          {/* Master Sound Volume Row */}
          <div className={styles.sliderControlRow}>
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className={styles.muteBtn}
              title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
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
              className={styles.volumeSlider}
              title={`Master Volume: ${Math.round(soundVolume * 100)}%`}
            />
            <span className={styles.volumePct}>{soundMuted ? 'MUTED' : `${Math.round(soundVolume * 100)}%`}</span>
          </div>

          <div className={styles.flyoutFooter}>
            <button
              onClick={() => {
                toggleQuickSettings();
                setLocked(true);
              }}
              className={styles.lockBtn}
            >
              <Lock size={12} />
              <span>LOCK DESKTOP</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
