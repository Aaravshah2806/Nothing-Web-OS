import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Search,
  FileText,
  Eye,
  Edit3,
  Download,
} from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { playMechanicalClick, playTactileClick } from '../../lib/soundEngine';
import styles from './NotesApp.module.css';

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Nothing Design Manifesto',
    content: `# Nothing Design Manifesto\n\n1. **Monochrome first, red as signal.**\n2. **Dot-matrix as texture, not just type.**\n3. **Transparency & layering** through frosted glass.\n4. **Strict 8px grid discipline** across every viewport.\n\n### Core Checklist\n- [x] Wireframe desktop canvas\n- [x] Hardware Glyph Composer backplate\n- [ ] Realtime Supabase Database Sync\n- [x] Procedural sound engine`,
    updatedAt: new Date().toLocaleDateString(),
    tag: '#FF3B30',
  },
  {
    id: 'note-2',
    title: 'Glyph OS Roadmap',
    content: `# Glyph OS (1) Engineering Roadmap\n\n### Phase 1: MVP Desktop Shell\n- [x] Window Manager with 8-way resize\n- [x] Aero snapping & Alt+Tab switcher\n- [x] Real-time sound synthesizer\n\n### Phase 2: Power Utilities\n- [x] Pomodoro Focus Timer with ambient audio\n- [x] Voice Dictaphone audio memo capture\n- [x] Developer Tools & hash calculator\n\n> "Technology should feel natural and effortless."`,
    updatedAt: new Date().toLocaleDateString(),
    tag: '#F5F5F5',
  },
];

// Lightweight Markdown Renderer (no heavy external libs needed)
function MarkdownRenderer({ content }) {
  const lines = content.split('\n');

  return (
    <div className={styles.markdownRender}>
      {lines.map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className={styles.mdH1}>{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className={styles.mdH2}>{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className={styles.mdH3}>{line.slice(4)}</h3>;
        }
        if (line.startsWith('> ')) {
          return <blockquote key={idx} className={styles.mdQuote}>{line.slice(2)}</blockquote>;
        }
        if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
          const checked = line.startsWith('- [x] ');
          return (
            <div key={idx} className={styles.mdTodoItem}>
              <span className={`${styles.mdCheck} ${checked ? styles.mdCheckDone : ''}`}>
                {checked ? '✓' : ' '}
              </span>
              <span className={checked ? styles.mdTodoDone : ''}>{line.slice(6)}</span>
            </div>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <div key={idx} className={styles.mdBullet}>
              <span className={styles.bulletDot}>•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className={styles.mdBlankLine} />;
        }
        return <p key={idx} className={styles.mdParagraph}>{line}</p>;
      })}
    </div>
  );
}

export default function NotesApp() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('glyph_os_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [activeNoteId, setActiveNoteId] = useState(() => notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { setQuickNote, addNotification } = useDesktopStore();

  useEffect(() => {
    try {
      localStorage.setItem('glyph_os_notes', JSON.stringify(notes));
      // Sync active or top note with desktop QuickNote widget
      if (notes.length > 0) {
        setQuickNote(notes[0].content);
      }
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [notes, setQuickNote]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    playMechanicalClick();
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '# New Thought\n\nWrite something in Glyph OS...',
      updatedAt: new Date().toLocaleDateString(),
      tag: '#FF3B30',
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
    playMechanicalClick();
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining[0]?.id || null);
    }
  };

  const handleUpdateActive = (field, value) => {
    if (!activeNote) return;
    setNotes(
      notes.map((n) =>
        n.id === activeNote.id
          ? { ...n, [field]: value, updatedAt: new Date().toLocaleDateString() }
          : n
      )
    );
  };

  const handleExportNote = () => {
    if (!activeNote) return;
    playTactileClick();
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeNote.title || 'note').replace(/\s+/g, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      title: 'NOTE EXPORTED',
      message: `Downloaded ${a.download} to your computer.`,
    });
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wordCount = activeNote?.content.trim()
    ? activeNote.content.trim().split(/\s+/).length
    : 0;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button onClick={handleCreateNote} className={styles.newButton} title="New Note">
            <Plus size={16} />
          </button>
        </div>

        <div className={styles.noteList}>
          {filteredNotes.length === 0 ? (
            <div className={styles.emptyList}>NO NOTES FOUND</div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => {
                  playTactileClick();
                  setActiveNoteId(note.id);
                }}
                className={`${styles.noteItem} ${note.id === activeNote?.id ? styles.activeNoteItem : ''}`}
              >
                <div className={styles.noteItemTop}>
                  <div
                    className={styles.colorPill}
                    style={{ backgroundColor: note.tag || 'var(--accent)' }}
                  />
                  <span className={styles.noteItemTitle}>{note.title || 'Untitled'}</span>
                  <button
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className={styles.deleteBtn}
                    title="Delete Note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className={styles.noteItemSnippet}>
                  {note.content.replace(/[#*`_>]/g, '').slice(0, 45) || 'No text...'}
                </div>
                <div className={styles.noteItemDate}>{note.updatedAt}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Main */}
      <div className={styles.editor}>
        {activeNote ? (
          <>
            <div className={styles.editorToolbar}>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActive('title', e.target.value)}
                placeholder="Note Title"
                className={styles.titleInput}
              />

              <div className={styles.toolbarActions}>
                <button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={`${styles.toolBtn} ${isPreviewMode ? styles.activeToolBtn : ''}`}
                  title={isPreviewMode ? 'Switch to Edit' : 'Markdown Preview'}
                >
                  {isPreviewMode ? <Edit3 size={14} /> : <Eye size={14} />}
                  <span>{isPreviewMode ? 'EDIT' : 'PREVIEW'}</span>
                </button>

                <button onClick={handleExportNote} className={styles.toolBtn} title="Download .md file">
                  <Download size={14} />
                  <span>EXPORT .MD</span>
                </button>
              </div>

              <div className={styles.tagSelector}>
                {['#FF3B30', '#F5F5F5', '#8C8C8C', '#FFD400', '#007AFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleUpdateActive('tag', color)}
                    className={`${styles.tagDot} ${activeNote.tag === color ? styles.tagDotActive : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {isPreviewMode ? (
              <div className={styles.previewContainer}>
                <MarkdownRenderer content={activeNote.content} />
              </div>
            ) : (
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateActive('content', e.target.value)}
                placeholder="Write in Markdown (# Heading, - [ ] Todo, **bold**)..."
                className={styles.contentTextarea}
                spellCheck="false"
              />
            )}

            <div className={styles.editorFooter}>
              <span>WORDS: {wordCount}</span>
              <span>LAST EDITED: {activeNote.updatedAt}</span>
              <span className={styles.syncStatus}>• SYNCED TO DESKTOP WIDGET</span>
            </div>
          </>
        ) : (
          <div className={styles.noActiveNote}>
            <FileText size={36} />
            <p>SELECT OR CREATE A NOTE</p>
          </div>
        )}
      </div>
    </div>
  );
}
