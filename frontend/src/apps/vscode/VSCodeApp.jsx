import React, { useState, useRef } from 'react';
import { RotateCw, ExternalLink, GitBranch, Code, Check } from 'lucide-react';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './VSCodeApp.module.css';

export default function VSCodeApp({ initialRepo = '' }) {
  const [currentUrl, setCurrentUrl] = useState(
    initialRepo ? `https://vscode.dev/github/${initialRepo}` : 'https://vscode.dev'
  );
  const [repoInput, setRepoInput] = useState(initialRepo);
  const [showRepoBar, setShowRepoBar] = useState(false);
  const iframeRef = useRef(null);

  const handleOpenRepo = (e) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    playMechanicalClick();
    const cleanRepo = repoInput.replace(/^https?:\/\/github\.com\//, '').trim();
    setCurrentUrl(`https://vscode.dev/github/${cleanRepo}`);
    setShowRepoBar(false);
  };

  const handleReload = () => {
    playMechanicalClick();
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  return (
    <div className={styles.container}>
      {/* VS Code Window Subheader */}
      <div className={styles.subHeader}>
        <div className={styles.leftInfo}>
          <Code size={14} style={{ color: '#007ACC' }} />
          <span className={styles.titleBadge}>VS CODE FOR WEB</span>
          <span className={styles.dotSeparator}>•</span>
          <span className={styles.runtimeTag}>BROWSER INSTANCE</span>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => setShowRepoBar(!showRepoBar)}
            className={`${styles.actionBtn} ${showRepoBar ? styles.activeActionBtn : ''}`}
            title="Open GitHub Repository in VS Code"
          >
            <GitBranch size={13} />
            <span>OPEN GITHUB REPO</span>
          </button>
          <button onClick={handleReload} className={styles.iconBtn} title="Reload Editor">
            <RotateCw size={13} />
          </button>
          <button
            onClick={() => window.open(currentUrl, '_blank', 'noopener,noreferrer')}
            className={styles.iconBtn}
            title="Popout into new tab"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* GitHub Repo Quick Load Bar */}
      {showRepoBar && (
        <form onSubmit={handleOpenRepo} className={styles.repoBar}>
          <GitBranch size={14} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="e.g. Runixe786/NThing-UI or vercel/next.js"
            value={repoInput}
            onChange={(e) => setRepoInput(e.target.value)}
            className={styles.repoInput}
            autoFocus
          />
          <button type="submit" className={styles.repoLoadBtn}>
            <Check size={12} />
            <span>LOAD IN EDITOR</span>
          </button>
        </form>
      )}

      {/* Embedded VS Code Web Canvas */}
      <div className={styles.frameContainer}>
        <iframe
          ref={iframeRef}
          src={currentUrl}
          title="VS Code Dev Web Editor"
          className={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    </div>
  );
}
