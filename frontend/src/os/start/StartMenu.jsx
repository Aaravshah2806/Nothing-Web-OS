import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Sparkles, ExternalLink, Power, Moon, RotateCcw, Lock } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { APP_REGISTRY, getAppList } from '../../apps/appRegistry';
import { playMechanicalClick, playCloseChime } from '../../lib/soundEngine';
import styles from './StartMenu.module.css';

const WEB_SHORTCUTS = [
  { id: 'web-browser', name: 'NOTHING WEB', icon: '/icons/nthing/chrome.png', appId: 'browser' },
  { id: 'web-vsc', name: 'VS CODE', icon: '/icons/nthing/vsc.png', appId: 'vscode' },
  { id: 'web-spotify', name: 'SPOTIFY', icon: '/icons/nthing/spotify.png', appId: 'spotify' },
  { id: 'web-yt', name: 'YOUTUBE', icon: '/icons/nthing/youtube.png', appId: 'youtube' },
  { id: 'web-gh', name: 'GITHUB', icon: '/icons/nthing/github.png', appId: 'github' },
  { id: 'web-board', name: 'WHITEBOARD', icon: '/icons/nthing/ps.png', appId: 'whiteboard' },
  { id: 'web-figma', name: 'FIGMA', icon: '/icons/nthing/figma.png', appId: 'figma' },
  { id: 'web-discord', name: 'DISCORD', icon: '/icons/nthing/discord.png', appId: 'discord' },
  { id: 'web-reddit', name: 'REDDIT', icon: '/icons/nthing/reddit.png', appId: 'reddit' },
];

export default function StartMenu() {
  const { startMenuOpen, setStartMenuOpen, setLocked, addNotification, setBooting } = useDesktopStore();
  const openApp = useWindowStore((state) => state.openApp);
  const [search, setSearch] = useState('');
  const [ramPct, setRamPct] = useState(48);
  const [batteryPct, setBatteryPct] = useState(94);
  const containerRef = useRef(null);

  const apps = getAppList();

  // Close on outside click or Escape key
  useEffect(() => {
    if (!startMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStartMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startMenuOpen, setStartMenuOpen]);

  // Read telemetry if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryPct(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryPct(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }

    if (performance && performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.jsHeapSizeLimit;
      if (total > 0) {
        setRamPct(Math.min(98, Math.max(15, Math.round((used / total) * 100))));
      }
    }
  }, [startMenuOpen]);

  if (!startMenuOpen) return null;

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLaunchApp = (app) => {
    playMechanicalClick();
    openApp(app);
    setStartMenuOpen(false);
  };

  const handleLaunchShortcut = (sc) => {
    playMechanicalClick();
    const app = APP_REGISTRY[sc.appId] || APP_REGISTRY.browser;
    if (app) {
      openApp(app);
    }
    setStartMenuOpen(false);
  };

  const handleLock = () => {
    playMechanicalClick();
    setStartMenuOpen(false);
    setLocked(true);
  };

  const handleSleep = () => {
    playMechanicalClick();
    setStartMenuOpen(false);
    addNotification({
      title: 'STANDBY MODE',
      message: 'System entered low-power idle standby.',
    });
    setLocked(true);
  };

  const handleRestart = () => {
    playMechanicalClick();
    setStartMenuOpen(false);
    setBooting(true);
  };

  const handleShutdown = () => {
    playCloseChime();
    setStartMenuOpen(false);
    document.body.style.transition = 'filter 1s ease, opacity 1s ease';
    document.body.style.filter = 'brightness(0)';
    setTimeout(() => {
      setLocked(true);
      document.body.style.filter = '';
    }, 1200);
  };

  return (
    <>
      <div className={styles.startMenuOverlay} onClick={() => setStartMenuOpen(false)} />
      <aside
        ref={containerRef}
        className={styles.startMenuContainer}
        onClick={(e) => e.stopPropagation()}
        aria-label="Nothing OS Start Menu"
      >
        {/* User Profile & Quick Search */}
        <div className={styles.header}>
          <div className={styles.userRow}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <User size={20} style={{ color: 'var(--text-secondary)' }} />
                <div className={styles.avatarDot} />
              </div>
              <div>
                <div className={styles.userName}>GLYPH OS (1)</div>
                <div className={styles.userBadge}>POWERED BY NTHING-UI</div>
              </div>
            </div>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          </div>

          <div className={styles.searchBox}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search apps, tools, web..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.scrollContent}>
          {/* Pinned Applications */}
          <div>
            <div className={styles.sectionTitle}>
              <span>PINNED APPS</span>
              <span>{filteredApps.length}</span>
            </div>
            <div className={styles.appGrid}>
              {filteredApps.map((app) => {
                const IconComponent = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleLaunchApp(app)}
                    className={styles.appCard}
                    title={`Open ${app.name}`}
                  >
                    <div className={styles.appIconWrap}>
                      {app.imageIcon ? (
                        <img
                          src={app.imageIcon}
                          alt={app.name}
                          className={styles.appIconImg}
                          draggable={false}
                        />
                      ) : (
                        <IconComponent size={22} style={{ color: 'var(--text-primary)' }} />
                      )}
                    </div>
                    <span className={styles.appName}>{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Life Apps & Web Shortcuts */}
          <div>
            <div className={styles.sectionTitle}>
              <span>REAL-LIFE APPS & WEB</span>
              <Sparkles size={11} style={{ color: 'var(--accent)' }} />
            </div>
            <div className={styles.appGrid}>
              {WEB_SHORTCUTS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleLaunchShortcut(sc)}
                  className={styles.appCard}
                  title={`Open ${sc.name} as Window`}
                >
                  <div className={styles.appIconWrap}>
                    <img src={sc.icon} alt={sc.name} className={styles.appIconImg} draggable={false} />
                  </div>
                  <span className={styles.appName}>{sc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live System Telemetry */}
          <div className={styles.telemetryBar}>
            <div className={styles.telemetryItem}>
              <div className={styles.telemetryDot} />
              <span>RAM LOAD:</span>
              <span className={styles.telemetryValue}>{ramPct}%</span>
            </div>
            <div className={styles.telemetryItem}>
              <span>BATTERY:</span>
              <span className={styles.telemetryValue}>{batteryPct}%</span>
            </div>
            <div className={styles.telemetryItem}>
              <span>NTHING:</span>
              <span className={styles.telemetryValue}>v1.0 BETA</span>
            </div>
          </div>
        </div>

        {/* Power Menu Footer */}
        <footer className={styles.powerFooter}>
          <div className={styles.powerActions}>
            <button onClick={handleSleep} className={styles.powerBtn} title="Sleep Mode">
              <Moon size={12} />
              <span>SLEEP</span>
            </button>
            <button onClick={handleLock} className={styles.powerBtn} title="Lock Desktop">
              <Lock size={12} />
              <span>LOCK</span>
            </button>
          </div>

          <div className={styles.powerActions}>
            <button onClick={handleRestart} className={styles.powerBtn} title="Restart System">
              <RotateCcw size={12} />
              <span>RESTART</span>
            </button>
            <button
              onClick={handleShutdown}
              className={`${styles.powerBtn} ${styles.powerBtnDanger}`}
              title="Shut Down System"
            >
              <Power size={12} />
              <span>SHUT DOWN</span>
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
