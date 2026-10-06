import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  RotateCw,
  GitFork,
  Code,
  Flame,
  Compass,
  Check,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { playMechanicalClick, playTactileClick } from '../../lib/soundEngine';
import styles from './GitHubApp.module.css';

const FEATURED_REPOS = [
  { name: 'NTHING-UI', path: 'Runixe786/NThing-UI', desc: 'Rainmeter Nothing OS suite' },
  { name: 'REACT', path: 'facebook/react', desc: 'React core library' },
  { name: 'NEXT.JS', path: 'vercel/next.js', desc: 'React full-stack framework' },
  { name: 'LINUX', path: 'torvalds/linux', desc: 'Linux kernel source' },
  { name: 'SHADCN UI', path: 'shadcn-ui/ui', desc: 'Modern UI components' },
];

export default function GitHubApp({ initialRepo = 'Runixe786/NThing-UI' }) {
  const [activeRepo, setActiveRepo] = useState(initialRepo);
  const [inputVal, setInputVal] = useState(initialRepo);
  const [viewMode, setViewMode] = useState('live'); // 'live' | 'code' | 'vscode' | 'trending'
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);

  const getResolvedUrl = () => {
    if (viewMode === 'trending') {
      return `/api/proxy?url=${encodeURIComponent('https://github.com/trending')}`;
    }
    if (viewMode === 'explore') {
      return `/api/proxy?url=${encodeURIComponent('https://github.com/explore')}`;
    }
    if (viewMode === 'code') {
      return `https://github1s.com/${activeRepo}`;
    }
    if (viewMode === 'vscode') {
      return `https://vscode.dev/github/${activeRepo}`;
    }
    // Default 'live': Live real github.com unblocked via Nothing Web OS Proxy
    return `/api/proxy?url=${encodeURIComponent(`https://github.com/${activeRepo}`)}`;
  };

  const handleSelectRepo = (path) => {
    playMechanicalClick();
    setActiveRepo(path);
    setInputVal(path);
    if (viewMode === 'trending' || viewMode === 'explore') {
      setViewMode('live');
    }
    setIsLoading(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    playMechanicalClick();
    let clean = inputVal.replace(/^https?:\/\/github\.com\//, '').trim();
    clean = clean.replace(/^\/+|\/+$/g, '');
    setActiveRepo(clean);
    if (viewMode === 'trending' || viewMode === 'explore') {
      setViewMode('live');
    }
    setIsLoading(true);
  };

  const handleReload = () => {
    playTactileClick();
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = getResolvedUrl();
    }
  };

  const handleModeChange = (mode) => {
    playTactileClick();
    setViewMode(mode);
    setIsLoading(true);
  };

  const currentEmbedUrl = getResolvedUrl();

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.iconWrap}>
            <Globe size={16} className={styles.ghLogo} />
          </div>
          <div>
            <div className={styles.title}>GITHUB LIVE</div>
            <div className={styles.subtitle}>REAL REPOSITORIES & WEB VIEWER</div>
          </div>
        </div>

        {/* Repo Search Bar */}
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <Search size={13} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Type any user/repo or GitHub URL..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.loadBtn}>
            LOAD
          </button>
        </form>

        <div className={styles.rightActions}>
          <button onClick={handleReload} className={styles.iconBtn} title="Reload GitHub View">
            <RotateCw size={13} className={isLoading ? styles.spinning : ''} />
          </button>
          <button
            onClick={() => window.open(`https://github.com/${activeRepo}`, '_blank', 'noopener,noreferrer')}
            className={styles.iconBtn}
            title="Popout to GitHub.com"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Mode Switcher & Quick Navigation Bar */}
      <div className={styles.controlBar}>
        {/* Mode Selector Segmented Tabs */}
        <div className={styles.modeTabs}>
          <button
            onClick={() => handleModeChange('live')}
            className={`${styles.modeTab} ${viewMode === 'live' ? styles.activeModeTab : ''}`}
            title="Live Real GitHub.com"
          >
            <Globe size={12} />
            <span>REAL GITHUB</span>
          </button>

          <button
            onClick={() => handleModeChange('code')}
            className={`${styles.modeTab} ${viewMode === 'code' ? styles.activeModeTab : ''}`}
            title="Fast Code & File Tree (GitHub 1s)"
          >
            <Code size={12} />
            <span>CODE TREE (1S)</span>
          </button>

          <button
            onClick={() => handleModeChange('vscode')}
            className={`${styles.modeTab} ${viewMode === 'vscode' ? styles.activeModeTab : ''}`}
            title="VS Code Web IDE"
          >
            <Terminal size={12} />
            <span>VS CODE WEB</span>
          </button>

          <button
            onClick={() => handleModeChange('trending')}
            className={`${styles.modeTab} ${viewMode === 'trending' ? styles.activeModeTab : ''}`}
            title="GitHub Trending Repositories"
          >
            <Flame size={12} />
            <span>TRENDING</span>
          </button>
        </div>

        {/* Featured Repos Pill List */}
        <div className={styles.featuredRepos}>
          <span className={styles.featuredLabel}>QUICK:</span>
          {FEATURED_REPOS.map((r) => {
            const isSelected = activeRepo.toLowerCase() === r.path.toLowerCase() && viewMode !== 'trending';
            return (
              <button
                key={r.path}
                onClick={() => handleSelectRepo(r.path)}
                className={`${styles.repoPill} ${isSelected ? styles.activeRepoPill : ''}`}
                title={r.desc}
              >
                <GitFork size={10} />
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Bar */}
      {isLoading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingFill} />
        </div>
      )}

      {/* Embedded Real GitHub Frame */}
      <div className={styles.frameWrap}>
        <iframe
          ref={iframeRef}
          src={currentEmbedUrl}
          title={`GitHub Explorer - ${activeRepo}`}
          className={styles.frame}
          onLoad={() => setIsLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    </div>
  );
}
