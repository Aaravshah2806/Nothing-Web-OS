import React, { useState } from 'react';
import { Folder, FileText, Image as ImageIcon, Trash2, HardDrive, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './FileManagerApp.module.css';

const INITIAL_FS = [
  { id: '1', name: 'README.md', type: 'file', size: '420 B', modified: '2026.09.24', icon: FileText },
  { id: '2', name: 'Design_Tokens.json', type: 'file', size: '1.2 KB', modified: '2026.09.23', icon: FileText },
  { id: '3', name: 'Glyph_Wallpaper.raw', type: 'file', size: '3.4 MB', modified: '2026.09.21', icon: ImageIcon },
  { id: '4', name: 'Projects', type: 'folder', size: '—', modified: '2026.09.20', icon: Folder },
  { id: '5', name: 'Audio_Stems', type: 'folder', size: '—', modified: '2026.09.19', icon: Folder },
];

export default function FileManagerApp() {
  const [items, setItems] = useState(INITIAL_FS);
  const [selectedId, setSelectedId] = useState(null);
  const [currentPath, setCurrentPath] = useState('/ home / user / storage');

  const selectedItem = items.find((i) => i.id === selectedId);

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:', 'New_Folder');
    if (!name) return;
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      size: '—',
      modified: new Date().toLocaleDateString(),
      icon: Folder,
    };
    setItems([newFolder, ...items]);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setItems(items.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>STORAGE DRIVE</div>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <HardDrive size={14} />
            <span>GLYPH SSD (128 GB)</span>
          </button>
        </div>

        <div className={styles.sidebarSection}>
          <div className={styles.sectionHeader}>DIRECTORIES</div>
          <button className={styles.navItem} onClick={() => setCurrentPath('/ home / user / desktop')}>
            <Folder size={14} />
            <span>Desktop</span>
          </button>
          <button className={styles.navItem} onClick={() => setCurrentPath('/ home / user / documents')}>
            <Folder size={14} />
            <span>Documents</span>
          </button>
          <button className={styles.navItem} onClick={() => setCurrentPath('/ home / user / gallery')}>
            <ImageIcon size={14} />
            <span>Pictures</span>
          </button>
          <button className={styles.navItem} onClick={() => setCurrentPath('/ home / user / trash')}>
            <Trash2 size={14} />
            <span>Trash</span>
          </button>
        </div>
      </div>

      {/* Main Files Area */}
      <div className={styles.mainArea}>
        {/* Toolbar & Breadcrumbs */}
        <div className={styles.toolbar}>
          <div className={styles.navControls}>
            <button className={styles.toolBtn} title="Back"><ArrowLeft size={14} /></button>
            <button className={styles.toolBtn} title="Forward"><ArrowRight size={14} /></button>
          </div>
          <div className={styles.pathBar}>{currentPath}</div>
          <button onClick={handleCreateFolder} className={styles.createBtn} title="New Folder">
            <Plus size={14} />
            <span>NEW FOLDER</span>
          </button>
        </div>

        {/* Files Grid */}
        <div className={styles.fileGrid} onClick={() => setSelectedId(null)}>
          {items.map((file) => {
            const IconComp = file.icon;
            const isSelected = selectedId === file.id;

            return (
              <div
                key={file.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(file.id);
                }}
                className={`${styles.fileCard} ${isSelected ? styles.selectedCard : ''}`}
              >
                <div className={styles.iconWrapper}>
                  <IconComp size={32} strokeWidth={1.4} />
                </div>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>{file.size}</span>
                <button
                  onClick={(e) => handleDelete(file.id, e)}
                  className={styles.deleteIcon}
                  title="Delete File"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Status / Detail Footer */}
        <div className={styles.footer}>
          <span>{items.length} ITEMS</span>
          <span>{selectedItem ? `SELECTED: ${selectedItem.name} (${selectedItem.size})` : 'READY'}</span>
        </div>
      </div>
    </div>
  );
}
