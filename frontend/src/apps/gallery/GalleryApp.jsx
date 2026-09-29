import React, { useState } from 'react';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import styles from './GalleryApp.module.css';

const DEFAULT_GALLERY = [
  {
    id: 'img-1',
    title: 'GLYPH_SURFACE_01.RAW',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    date: '2026.09.20',
    size: '2.4 MB',
  },
  {
    id: 'img-2',
    title: 'BRUTALIST_CONCRETE.RAW',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    date: '2026.09.21',
    size: '3.1 MB',
  },
  {
    id: 'img-3',
    title: 'TRANSPARENT_TECH.RAW',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    date: '2026.09.22',
    size: '1.8 MB',
  },
  {
    id: 'img-4',
    title: 'MONOCHROME_GRID.RAW',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    date: '2026.09.23',
    size: '4.2 MB',
  },
];

export default function GalleryApp() {
  const [images, setImages] = useState(DEFAULT_GALLERY);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUploadClick = () => {
    const title = prompt('Enter image title:', 'NEW_CAPTURE.RAW');
    const url = prompt('Enter direct image URL:', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80');
    if (url) {
      const newImg = {
        id: `img-${Date.now()}`,
        title: title || 'UNTITLED.RAW',
        url: url,
        date: new Date().toLocaleDateString(),
        size: '1.9 MB',
      };
      setImages([newImg, ...images]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>
          <ImageIcon size={16} />
          <span>GALLERY ARCHIVE</span>
        </div>
        <button onClick={handleUploadClick} className={styles.uploadBtn}>
          <Upload size={14} />
          <span>IMPORT ASSET</span>
        </button>
      </div>

      <div className={styles.grid}>
        {images.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className={styles.imageCard}
          >
            <img src={item.url} alt={item.title} className={styles.thumb} loading="lazy" />
            <div className={styles.imageInfo}>
              <span className={styles.imageTitle}>{item.title}</span>
              <span className={styles.imageMeta}>{item.date} • {item.size}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>{selectedImage.title}</span>
              <button onClick={() => setSelectedImage(null)} className={styles.closeBtn}>
                <X size={16} />
              </button>
            </div>
            <img src={selectedImage.url} alt={selectedImage.title} className={styles.fullImage} />
            <div className={styles.modalFooter}>
              <span>DATE: {selectedImage.date}</span>
              <span>FILE SIZE: {selectedImage.size}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
