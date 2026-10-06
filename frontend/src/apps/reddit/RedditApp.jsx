import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ArrowUp,
  ExternalLink,
  RotateCw,
  Search,
  Sparkles,
  Globe,
  Flame,
  Clock,
  Eye,
} from 'lucide-react';
import { playMechanicalClick, playTactileClick } from '../../lib/soundEngine';
import styles from './RedditApp.module.css';

const PRESET_SUBS = [
  { name: 'r/NothingTech', tag: 'NothingTech', desc: 'Nothing Phone & Audio discussions' },
  { name: 'r/technology', tag: 'technology', desc: 'Major tech news & breakthroughs' },
  { name: 'r/webdev', tag: 'webdev', desc: 'Web development community' },
  { name: 'r/gadgets', tag: 'gadgets', desc: 'Hardware & smart devices' },
];

export default function RedditApp() {
  const [sub, setSub] = useState('NothingTech');
  const [subInput, setSubInput] = useState('NothingTech');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('reader'); // 'reader' | 'live'

  const fetchPosts = async (targetSub) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://www.reddit.com/r/${targetSub}/hot.json?limit=25`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      const items = (data.data?.children || []).map((c) => c.data);
      setPosts(items);
    } catch (err) {
      console.warn('Direct Reddit fetch failed, using fallback or live proxy', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(sub);
  }, [sub]);

  const handleSelectSub = (target) => {
    playMechanicalClick();
    setSub(target);
    setSubInput(target);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!subInput.trim()) return;
    playMechanicalClick();
    const clean = subInput.replace(/^r\//, '').trim();
    setSub(clean);
  };

  const liveProxyUrl = `/api/proxy?url=${encodeURIComponent(`https://www.reddit.com/r/${sub}`)}`;

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.iconWrap}>
            <img src="/icons/nthing/reddit.png" alt="Reddit" className={styles.iconImg} />
          </div>
          <div>
            <div className={styles.title}>REDDIT FOR NOTHING OS</div>
            <div className={styles.subtitle}>REAL COMMUNITY DISCUSSIONS & FEEDS</div>
          </div>
        </div>

        {/* Subreddit Search Bar */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <span className={styles.prefix}>r/</span>
          <input
            type="text"
            placeholder="Type any subreddit name..."
            value={subInput}
            onChange={(e) => setSubInput(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.loadBtn}>
            VISIT
          </button>
        </form>

        <div className={styles.rightActions}>
          <button
            onClick={() => {
              playTactileClick();
              fetchPosts(sub);
            }}
            className={styles.iconBtn}
            title="Refresh Feed"
          >
            <RotateCw size={13} className={loading ? styles.spinning : ''} />
          </button>
          <button
            onClick={() => window.open(`https://reddit.com/r/${sub}`, '_blank', 'noopener,noreferrer')}
            className={styles.iconBtn}
            title="Open in reddit.com"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Subreddit Pills & Mode Bar */}
      <div className={styles.subBar}>
        <div className={styles.presetList}>
          {PRESET_SUBS.map((p) => {
            const isActive = sub.toLowerCase() === p.tag.toLowerCase();
            return (
              <button
                key={p.tag}
                onClick={() => handleSelectSub(p.tag)}
                className={`${styles.presetBtn} ${isActive ? styles.activePreset : ''}`}
                title={p.desc}
              >
                <Flame size={11} className={isActive ? styles.flameActive : ''} />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.viewToggle}>
          <button
            onClick={() => {
              playTactileClick();
              setViewMode('reader');
            }}
            className={`${styles.toggleBtn} ${viewMode === 'reader' ? styles.activeToggle : ''}`}
          >
            READER FEED
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setViewMode('live');
            }}
            className={`${styles.toggleBtn} ${viewMode === 'live' ? styles.activeToggle : ''}`}
          >
            LIVE WEB
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.viewport}>
        {viewMode === 'live' ? (
          /* Live Web View via Unblocked Proxy */
          <iframe
            src={liveProxyUrl}
            title={`Reddit - r/${sub}`}
            className={styles.frame}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : (
          /* Nothing OS Native Reddit Feed Reader */
          <div className={styles.feedScroll}>
            {loading && posts.length === 0 ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingDot} />
                <span>FETCHING LIVE POSTS FROM r/{sub}...</span>
              </div>
            ) : error && posts.length === 0 ? (
              <div className={styles.errorState}>
                <div className={styles.errorTitle}>SUBREDDIT FEED NOTICE</div>
                <p>Could not retrieve JSON feed for <code>r/{sub}</code>.</p>
                <button
                  onClick={() => setViewMode('live')}
                  className={styles.switchLiveBtn}
                >
                  SWITCH TO LIVE WEB VIEW
                </button>
              </div>
            ) : (
              <div className={styles.postList}>
                {posts.map((post) => (
                  <article key={post.id} className={styles.postCard}>
                    <div className={styles.voteColumn}>
                      <ArrowUp size={14} className={styles.upvoteIcon} />
                      <span className={styles.score}>
                        {post.score > 999 ? `${(post.score / 1000).toFixed(1)}k` : post.score}
                      </span>
                    </div>

                    <div className={styles.postContent}>
                      <div className={styles.metaRow}>
                        <span className={styles.authorBadge}>u/{post.author}</span>
                        <span className={styles.dotSep}>•</span>
                        <span className={styles.timeTag}>
                          {Math.floor((Date.now() / 1000 - post.created_utc) / 3600)}h ago
                        </span>
                        {post.link_flair_text && (
                          <span className={styles.flairBadge}>{post.link_flair_text}</span>
                        )}
                      </div>

                      <h3 className={styles.postTitle}>
                        <a
                          href={`https://reddit.com${post.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.postLink}
                        >
                          {post.title}
                        </a>
                      </h3>

                      {post.selftext && (
                        <p className={styles.postExcerpt}>
                          {post.selftext.slice(0, 220)}
                          {post.selftext.length > 220 ? '...' : ''}
                        </p>
                      )}

                      {post.thumbnail && post.thumbnail.startsWith('http') && (
                        <div className={styles.thumbnailWrap}>
                          <img
                            src={post.thumbnail}
                            alt=""
                            className={styles.thumbnail}
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className={styles.actionFooter}>
                        <div className={styles.actionItem}>
                          <MessageSquare size={12} />
                          <span>{post.num_comments} Comments</span>
                        </div>
                        <a
                          href={`https://reddit.com${post.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.openExternalLink}
                        >
                          <ExternalLink size={11} />
                          <span>VIEW THREAD</span>
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
