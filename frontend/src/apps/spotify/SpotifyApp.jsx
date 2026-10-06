import React, { useState } from 'react';
import { Disc, Play, ExternalLink, Music, Sparkles } from 'lucide-react';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './SpotifyApp.module.css';

const PRESET_PLAYLISTS = [
  {
    name: 'TODAYS TOP HITS',
    desc: 'Global Top Chart',
    id: '37i9dQZF1DXcBWIGoYBM5M',
  },
  {
    name: 'SYNTHWAVE PULSE',
    desc: 'Cyberpunk & Retrowave',
    id: '37i9dQZF1DXdLEN7aqioXM',
  },
  {
    name: 'DEEP FOCUS BEATS',
    desc: 'Ambient Coding Flow',
    id: '37i9dQZF1DWZeKCadgRdKQ',
  },
  {
    name: 'LO-FI GLYPH CHILL',
    desc: 'Nothing Soundscape Vibe',
    id: '37i9dQZF1DX3Ogo9pFvBkY',
  },
];

export default function SpotifyApp() {
  const [activePlaylistId, setActivePlaylistId] = useState(PRESET_PLAYLISTS[0].id);
  const [customInput, setCustomInput] = useState('');

  const handleSelectPreset = (id) => {
    playMechanicalClick();
    setActivePlaylistId(id);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    playMechanicalClick();
    // Parse spotify URI or URL
    const match = customInput.match(/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if (match) {
      const type = match[1];
      const id = match[2];
      setActivePlaylistId(`${type}/${id}`);
    } else {
      setActivePlaylistId(customInput.trim());
    }
  };

  const embedUrl = activePlaylistId.includes('/')
    ? `https://open.spotify.com/embed/${activePlaylistId}?utm_source=generator&theme=0`
    : `https://open.spotify.com/embed/playlist/${activePlaylistId}?utm_source=generator&theme=0`;

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.iconBadge}>
            <Disc size={18} className={styles.spotifyIcon} />
          </div>
          <div>
            <div className={styles.brandTitle}>SPOTIFY WEB</div>
            <div className={styles.brandSubtitle}>NOTHING AUDIO STATION</div>
          </div>
        </div>

        <button
          onClick={() => window.open(embedUrl, '_blank', 'noopener,noreferrer')}
          className={styles.popoutBtn}
          title="Open in Spotify Web Player"
        >
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Playlist Selector Pills */}
      <div className={styles.playlistRow}>
        {PRESET_PLAYLISTS.map((pl) => {
          const isSelected = activePlaylistId === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => handleSelectPreset(pl.id)}
              className={`${styles.presetPill} ${isSelected ? styles.selectedPill : ''}`}
            >
              <span className={styles.pillDot} />
              <span>{pl.name}</span>
            </button>
          );
        })}
      </div>

      {/* Custom URL Input */}
      <form onSubmit={handleCustomSubmit} className={styles.customBar}>
        <Music size={13} className={styles.customIcon} />
        <input
          type="text"
          placeholder="Paste any Spotify playlist, album, or track link..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className={styles.customInput}
        />
        <button type="submit" className={styles.loadBtn}>
          PLAY
        </button>
      </form>

      {/* Spotify Embed Player Frame */}
      <div className={styles.playerFrame}>
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Web Player"
        />
      </div>
    </div>
  );
}
