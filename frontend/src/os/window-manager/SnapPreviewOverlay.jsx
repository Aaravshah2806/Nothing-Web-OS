import React from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import styles from './SnapPreviewOverlay.module.css';

export default function SnapPreviewOverlay() {
  const snapPreview = useWindowStore((state) => state.snapPreview);

  if (!snapPreview || !snapPreview.active) return null;

  return (
    <div
      className={`${styles.previewZone} ${
        snapPreview.type === 'left'
          ? styles.snapLeft
          : snapPreview.type === 'right'
          ? styles.snapRight
          : styles.snapTop
      }`}
    />
  );
}
