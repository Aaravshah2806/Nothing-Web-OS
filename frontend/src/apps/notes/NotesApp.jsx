import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, FileText } from 'lucide-react';
import styles from './NotesApp.module.css';

const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Nothing Design Manifesto',
    content: `1. Monochrome first, red as signal.\n2. Dot-matrix as texture, not just type.\n3. Transparency & layering through frosted glass.\n4. Strict 8px grid discipline across every viewport.`,
    updatedAt: new Date().toLocaleDateString(),
    tag: '#FF3B30',
  },
  {
    id: 'note-2',
    title: 'Glyph OS Roadmap',
    content: `Phase 1: Core Desktop Shell & Window Manager.\nPhase 2: Live Weather Proxy & Supabase Storage sync.\nPhase 3: Real audio playback & custom widget builder.`,
    updatedAt: new Date().toLocaleDateString(),
    tag: '#F5F5F5',
  },
];

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

  useEffect(() => {
    try {
      localStorage.setItem('glyph_os_notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date().toLocaleDateString(),
      tag: '#FF3B30',
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id, e) => {
    e.stopPropagation();
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

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onClick={() => setActiveNoteId(note.id)}
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
                  {note.content.slice(0, 45) || 'No text...'}
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
              <div className={styles.tagSelector}>
                {['#FF3B30', '#F5F5F5', '#8C8C8C', '#FF9500'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleUpdateActive('tag', color)}
                    className={`${styles.tagDot} ${activeNote.tag === color ? styles.tagDotActive : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateActive('content', e.target.value)}
              placeholder="Write something in Glyph OS..."
              className={styles.contentTextarea}
            />
            <div className={styles.editorFooter}>
              <span>WORDS: {activeNote.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0}</span>
              <span>LAST EDITED: {activeNote.updatedAt}</span>
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
