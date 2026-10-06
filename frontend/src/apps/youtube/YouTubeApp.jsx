import React, { useState } from 'react';
import { Tv, Search, ExternalLink, Play, Sparkles } from 'lucide-react';
import { playMechanicalClick } from '../../lib/soundEngine';
import styles from './YouTubeApp.module.css';

const PRESET_CHANNELS = [
  {
    name: 'LOFI GIRL CHILL',
    desc: '24/7 Beats to Relax / Study',
    videoId: 'jfKfPfyJRdk',
  },
  {
    name: 'NOTHING TECH',
    desc: 'Nothing Design & Hardware',
    videoId: 'c_K5Jz3n5j0',
  },
  {
    name: 'SYNTHWAVE RADIO',
    desc: 'Chill Cyber Beats',
    videoId: '4xDzrJKXOOY',
  },
  {
    name: 'DEEP TECH CODING',
    desc: 'Coding Ambient Sound',
    videoId: 'TURbeWK2wwg',
  },
];

export default function YouTubeApp() {
  const [activeVideoId, setActiveVideoId] = useState(PRESET_CHANNELS[0].videoId);
  const [searchInput, setSearchInput] = useState('');

  const handleSelectPreset = (id) => {
    playMechanicalClick();
    setActiveVideoId(id);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    playMechanicalClick();

    // Check if input is a YouTube URL
    let vid = searchInput.trim();
    if (vid.includes('youtube.com/watch?v=')) {
      vid = vid.split('v=')[1]?.split('&')[0];
    } else if (vid.includes('youtu.be/')) {
      vid = vid.split('youtu.be/')[1]?.split('?')[0];
    }

    if (vid) {
      setActiveVideoId(vid);
    }
  };

  const embedUrl = `https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&enablejsapi=1&rel=0`;

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.iconWrap}>
            <Tv size={16} className={styles.ytIcon} />
          </div>
          <div>
            <div className={styles.title}>YOUTUBE PLAYER</div>
            <div className={styles.subtitle}>NOTHING EMBEDDED CINEMA</div>
          </div>
        </div>

        {/* Search / URL input */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={13} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Paste YouTube link or Video ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.playBtn}>
            <Play size={10} style={{ fill: 'currentColor' }} />
            <span>WATCH</span>
          </button>
        </form>

        <button
          onClick={() => window.open(`https://youtube.com/watch?v=${activeVideoId}`, '_blank', 'noopener,noreferrer')}
          className={styles.popoutBtn}
          title="Open in YouTube"
        >
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Preset Channels */}
      <div className={styles.presetsBar}>
        {PRESET_CHANNELS.map((ch) => {
          const isSelected = activeVideoId === ch.videoId;
          return (
            <button
              key={ch.videoId}
              onClick={() => handleSelectPreset(ch.videoId)}
              className={`${styles.presetBtn} ${isSelected ? styles.activePreset : ''}`}
            >
              <span className={styles.dotIndicator} />
              <span>{ch.name}</span>
            </button>
          );
        })}
      </div>

      {/* Video Player Frame */}
      <div className={styles.videoFrameWrap}>
        <iframe
          src={embedUrl}
          title="YouTube Video Player"
          className={styles.videoFrame}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
