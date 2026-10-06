import React, { useRef } from 'react';
import { Edit3, ExternalLink, RotateCw, Sparkles } from 'lucide-react';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './WhiteboardApp.module.css';

export default function WhiteboardApp() {
  const iframeRef = useRef(null);

  const handleReload = () => {
    playMechanicalClick();
    if (iframeRef.current) {
      iframeRef.current.src = 'https://excalidraw.com';
    }
  };

  return (
    <div className={styles.container}>
      {/* Subheader */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.iconWrap}>
            <Edit3 size={15} style={{ color: '#6965DB' }} />
          </div>
          <div>
            <div className={styles.title}>WHITEBOARD & DIAGRAMS</div>
            <div className={styles.subtitle}>POWERED BY EXCALIDRAW</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleReload} className={styles.iconBtn} title="Clear / Reload Canvas">
            <RotateCw size={13} />
          </button>
          <button
            onClick={() => window.open('https://excalidraw.com', '_blank', 'noopener,noreferrer')}
            className={styles.iconBtn}
            title="Open in new tab"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Embedded Excalidraw Frame */}
      <div className={styles.canvasWrap}>
        <iframe
          ref={iframeRef}
          src="https://excalidraw.com"
          title="Excalidraw Whiteboard"
          className={styles.frame}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
