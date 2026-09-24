import React, { useState, useEffect, useRef } from 'react';
import styles from './MarqueeSelection.module.css';

export default function MarqueeSelection() {
  const [selection, setSelection] = useState(null);
  const startPos = useRef({ x: 0, y: 0 });
  const isSelecting = useRef(false);

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Only start marquee if clicking directly on desktop canvas or icon container
      if (
        e.target.closest('[class*="Window_window"]') ||
        e.target.closest('[class*="WidgetGrid_draggableContainer"]') ||
        e.target.closest('[class*="Dock_dockContainer"]') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('[class*="Desktop_contextMenu"]')
      ) {
        return;
      }

      isSelecting.current = true;
      startPos.current = { x: e.clientX, y: e.clientY };
      setSelection({ x: e.clientX, y: e.clientY, width: 0, height: 0 });
    };

    const handlePointerMove = (e) => {
      if (!isSelecting.current) return;
      const currentX = e.clientX;
      const currentY = e.clientY;

      const left = Math.min(startPos.current.x, currentX);
      const top = Math.min(startPos.current.y, currentY);
      const width = Math.abs(currentX - startPos.current.x);
      const height = Math.abs(currentY - startPos.current.y);

      setSelection({ x: left, y: top, width, height });
    };

    const handlePointerUp = () => {
      if (isSelecting.current) {
        isSelecting.current = false;
        setSelection(null);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  if (!selection || selection.width < 5 || selection.height < 5) return null;

  return (
    <div
      className={styles.marqueeBox}
      style={{
        left: `${selection.x}px`,
        top: `${selection.y}px`,
        width: `${selection.width}px`,
        height: `${selection.height}px`,
      }}
    />
  );
}
