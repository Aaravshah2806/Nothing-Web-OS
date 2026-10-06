import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  Globe,
  ExternalLink,
  Search,
  Sparkles,
  ShieldCheck,
  Code,
  Disc,
  Tv,
  Edit3,
  Bookmark,
  Zap,
} from 'lucide-react';
import { playMechanicalClick, playTactileClick } from '../../lib/soundEngine';
import styles from './BrowserApp.module.css';

const DEFAULT_BOOKMARKS = [
  { name: 'GITHUB', icon: Globe, url: 'https://github.com/Runixe786/NThing-UI', color: '#FFFFFF' },
  { name: 'VS CODE', icon: Code, url: 'https://vscode.dev', color: '#007ACC' },
  { name: 'SPOTIFY', icon: Disc, url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0', color: '#1DB954' },
  { name: 'YOUTUBE', icon: Tv, url: 'https://www.youtube-nocookie.com/embed/jfKfPfyJRdk', color: '#FF0000' },
  { name: 'REDDIT', icon: Bookmark, url: 'https://www.reddit.com/r/NothingTech', color: '#FF4500' },
  { name: 'EXCALIDRAW', icon: Edit3, url: 'https://excalidraw.com', color: '#6965DB' },
  { name: 'WIKIPEDIA', icon: Bookmark, url: 'https://en.m.wikipedia.org/wiki/Nothing_(technology_company)', color: '#E0E0E0' },
  { name: 'HACKER NEWS', icon: Sparkles, url: 'https://news.ycombinator.com', color: '#FF6600' },
];

export default function BrowserApp({ initialUrl = '' }) {
  const [history, setHistory] = useState(initialUrl ? [initialUrl] : ['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [inputUrl, setInputUrl] = useState(initialUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const iframeRef = useRef(null);

  const currentUrl = history[historyIndex] || 'home';
  const isHome = currentUrl === 'home';

  // Helper to determine iframe src with unblocking proxy
  const resolveIframeSrc = (target) => {
    if (!target || target === 'home') return 'about:blank';
    if (target.startsWith('/api/proxy')) return target;

    // Sites that natively support iframing
    if (
      target.includes('vscode.dev') ||
      target.includes('youtube-nocookie.com') ||
      target.includes('spotify.com/embed') ||
      target.includes('excalidraw.com') ||
      target.includes('wikipedia.org') ||
      target.includes('news.ycombinator.com')
    ) {
      return target;
    }

    // If proxy is active, route external sites through backend proxy to bypass X-Frame-Options
    if (proxyEnabled) {
      return `/api/proxy?url=${encodeURIComponent(target)}`;
    }
    return target;
  };

  // Synchronize input with current active URL
  useEffect(() => {
    if (isHome) {
      setInputUrl('');
    } else {
      // Show clean destination in the address bar
      let displayUrl = currentUrl;
      if (displayUrl.startsWith('/api/proxy?url=')) {
        try {
          displayUrl = decodeURIComponent(displayUrl.split('/api/proxy?url=')[1]);
        } catch {}
      }
      setInputUrl(displayUrl);
    }
  }, [currentUrl, isHome]);

  const navigateTo = (rawTarget) => {
    playMechanicalClick();
    if (!rawTarget || rawTarget.trim() === '' || rawTarget === 'home') {
      const nextHist = [...history.slice(0, historyIndex + 1), 'home'];
      setHistory(nextHist);
      setHistoryIndex(nextHist.length - 1);
      return;
    }

    let target = rawTarget.trim();

    // Check if input is a search query vs direct URL
    const hasSpace = target.includes(' ');
    const hasDot = target.includes('.');
    if (hasSpace || !hasDot) {
      target = `https://duckduckgo.com/?q=${encodeURIComponent(target)}`;
    } else if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    // Convert regular YouTube watch links to embed links to prevent frame block
    if (target.includes('youtube.com/watch?v=')) {
      const videoId = target.split('v=')[1]?.split('&')[0];
      if (videoId) {
        target = `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    } else if (target.includes('youtu.be/')) {
      const videoId = target.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        target = `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }

    setIsLoading(true);

    const nextHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigateTo(inputUrl);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      playTactileClick();
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      playTactileClick();
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReload = () => {
    playTactileClick();
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = resolveIframeSrc(currentUrl);
    }
  };

  const handleHome = () => {
    playTactileClick();
    navigateTo('home');
  };

  const iframeSrc = resolveIframeSrc(currentUrl);

  return (
    <div className={styles.browserContainer}>
      {/* Top Browser Navigation Bar */}
      <div className={styles.navBar}>
        <div className={styles.navControls}>
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className={styles.navBtn}
            title="Back"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className={styles.navBtn}
            title="Forward"
          >
            <ArrowRight size={15} />
          </button>
          <button
            onClick={handleReload}
            className={`${styles.navBtn} ${isLoading ? styles.spinning : ''}`}
            title="Reload"
          >
            <RotateCw size={14} />
          </button>
          <button
            onClick={handleHome}
            className={`${styles.navBtn} ${isHome ? styles.activeHome : ''}`}
            title="Browser Home"
          >
            <Home size={14} />
          </button>
        </div>

        {/* Address Bar */}
        <div className={styles.addressBar}>
          <div className={styles.securityTag}>
            <Lock size={12} className={styles.lockIcon} />
            <span className={styles.securityText}>SECURE</span>
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type web address or search terms..."
            className={styles.urlInput}
          />

          {/* Proxy Unblocker Badge */}
          <button
            onClick={() => {
              playTactileClick();
              setProxyEnabled(!proxyEnabled);
            }}
            className={`${styles.proxyBadge} ${proxyEnabled ? styles.proxyActive : ''}`}
            title="Toggle Nothing OS Live Frame Unblocker Proxy"
          >
            <Zap size={10} />
            <span>{proxyEnabled ? 'PROXY UNBLOCK' : 'DIRECT'}</span>
          </button>

          {inputUrl && (
            <button
              onClick={() => setInputUrl('')}
              className={styles.clearBtn}
              title="Clear"
            >
              ×
            </button>
          )}
        </div>

        {/* Right Tools */}
        <div className={styles.rightTools}>
          {!isHome && (
            <button
              onClick={() => window.open(inputUrl || currentUrl, '_blank', 'noopener,noreferrer')}
              className={styles.navBtn}
              title="Popout into new tab (Optional)"
            >
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Bookmarks Bar */}
      <div className={styles.bookmarksBar}>
        <span className={styles.bookmarksLabel}>HOT:</span>
        <div className={styles.bookmarksList}>
          {DEFAULT_BOOKMARKS.map((bm) => {
            const Icon = bm.icon;
            const isActive = currentUrl === bm.url;
            return (
              <button
                key={bm.name}
                onClick={() => navigateTo(bm.url)}
                className={`${styles.bookmarkChip} ${isActive ? styles.activeChip : ''}`}
                title={`Open ${bm.name}`}
              >
                <Icon size={12} style={{ color: bm.color }} />
                <span>{bm.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBarFill} />
        </div>
      )}

      {/* Main View Area */}
      <div className={styles.viewport}>
        {isHome ? (
          /* Nothing OS Browser Home Dashboard */
          <div className={styles.homeDashboard}>
            <div className={styles.homeHero}>
              <div className={styles.nothingBadge}>NOTHING BROWSER (1)</div>
              <h1 className={styles.heroTitle}>CONNECTED WEB</h1>
              <p className={styles.heroSubtitle}>
                Run real GitHub, VS Code, Spotify, and live websites with built-in frame unblocking.
              </p>

              {/* Central Search */}
              <div className={styles.homeSearchBox}>
                <Search size={18} className={styles.searchPromptIcon} />
                <input
                  type="text"
                  placeholder="Search DuckDuckGo or paste any website URL..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      navigateTo(e.target.value);
                    }
                  }}
                  className={styles.homeSearchInput}
                  autoFocus
                />
              </div>
            </div>

            {/* Quick App Launcher Grid */}
            <div className={styles.homeGridSection}>
              <div className={styles.gridSectionHeader}>
                <span className={styles.sectionHeading}>FEATURED REAL-LIFE WEB APPS</span>
                <span className={styles.sectionCounter}>{DEFAULT_BOOKMARKS.length} APPS READY</span>
              </div>

              <div className={styles.appGrid}>
                {DEFAULT_BOOKMARKS.map((app) => {
                  const Icon = app.icon;
                  return (
                    <div
                      key={app.name}
                      onClick={() => navigateTo(app.url)}
                      className={styles.appCard}
                    >
                      <div className={styles.appIconPill} style={{ borderColor: `${app.color}44` }}>
                        <Icon size={24} style={{ color: app.color }} />
                      </div>
                      <div className={styles.cardDetails}>
                        <div className={styles.cardTitle}>{app.name}</div>
                        <div className={styles.cardHost}>
                          {app.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technology Footer Info */}
            <div className={styles.homeFooter}>
              <div className={styles.footerItem}>
                <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
                <span>FRAME-UNBLOCK PROXY READY</span>
              </div>
              <div className={styles.footerItem}>
                <span>STATUS:</span>
                <span className={styles.footerVal}>REAL-WORLD WEB ACTIVE</span>
              </div>
              <div className={styles.footerItem}>
                <span>RENDERER:</span>
                <span className={styles.footerVal}>IN-PAGE WINDOWS</span>
              </div>
            </div>
          </div>
        ) : (
          /* Live Sandboxed Iframe with Unblocked Proxy */
          <div className={styles.iframeWrapper}>
            <iframe
              ref={iframeRef}
              src={iframeSrc}
              title="Nothing OS Web View"
              className={styles.webFrame}
              onLoad={() => setIsLoading(false)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-downloads allow-modals"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; camera; microphone"
            />
          </div>
        )}
      </div>
    </div>
  );
}
