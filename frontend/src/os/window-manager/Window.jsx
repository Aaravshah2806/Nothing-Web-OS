import React, { useRef } from 'react';
import { useWindowStore } from '../../store/useWindowStore';
import styles from './Window.module.css';

class WindowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>APP_TERMINATED_UNEXPECTEDLY</div>
          <p className={styles.errorMessage}>{String(this.state.error?.message || 'Unknown error occurred.')}</p>
          <button onClick={() => this.setState({ hasError: false })} className={styles.retryBtn}>
            RELOAD APPLICATION
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Window({ windowData, app }) {
  const {
    id,
    title,
    x,
    y,
    width,
    height,
    zIndex,
    minimized,
    maximized,
    snapState = 'none',
  } = windowData;

  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindowDir,
    snapWindow,
    setSnapPreview,
    focusedWindowId,
  } = useWindowStore();

  const isFocused = focusedWindowId === id;
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, initX: 0, initY: 0 });

  const isResizing = useRef(false);
  const resizeStart = useRef({ direction: '', mouseX: 0, mouseY: 0, initX: 0, initY: 0, initW: 0, initH: 0 });

  const handleTitlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    focusWindow(id);

    // If window is currently maximized or snapped, dragging detaches it
    let currentX = x;
    let currentY = y;
    if (maximized || snapState !== 'none') {
      const restoredW = windowData.prevBounds?.width || 560;
      currentX = Math.max(20, Math.min(window.innerWidth - restoredW - 20, e.clientX - Math.floor(restoredW / 2)));
      currentY = 20;
      snapWindow(id, 'none');
      moveWindow(id, currentX, currentY);
    }

    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: currentX,
      initY: currentY,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleTitlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    const newX = dragStart.current.initX + dx;
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.initY + dy));

    moveWindow(id, newX, newY);

    // Check for Aero Edge Snapping threshold (< 20px)
    if (e.clientX <= 20) {
      setSnapPreview({ active: true, type: 'left' });
    } else if (e.clientX >= window.innerWidth - 20) {
      setSnapPreview({ active: true, type: 'right' });
    } else if (e.clientY <= 15) {
      setSnapPreview({ active: true, type: 'top' });
    } else {
      setSnapPreview(null);
    }
  };

  const handleTitlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      const preview = useWindowStore.getState().snapPreview;
      if (preview && preview.active) {
        snapWindow(id, preview.type);
      }
      setSnapPreview(null);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // 8-Directional Resizing
  const handleResizePointerDown = (e, direction) => {
    if (maximized || snapState !== 'none') return;
    e.stopPropagation();
    focusWindow(id);

    isResizing.current = true;
    resizeStart.current = {
      direction,
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: x,
      initY: y,
      initW: width,
      initH: height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e) => {
    if (!isResizing.current) return;
    const { direction, mouseX, mouseY, initX, initY, initW, initH } = resizeStart.current;
    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;

    let newX = initX;
    let newY = initY;
    let newW = initW;
    let newH = initH;

    const minW = 320;
    const minH = 220;

    if (direction.includes('e')) {
      newW = Math.max(minW, initW + dx);
    }
    if (direction.includes('s')) {
      newH = Math.max(minH, initH + dy);
    }
    if (direction.includes('w')) {
      const candidateW = initW - dx;
      if (candidateW >= minW) {
        newW = candidateW;
        newX = initX + dx;
      }
    }
    if (direction.includes('n')) {
      const candidateH = initH - dy;
      if (candidateH >= minH) {
        newH = candidateH;
        newY = initY + dy;
      }
    }

    resizeWindowDir(id, { x: newX, y: newY, width: newW, height: newH });
  };

  const handleResizePointerUp = (e) => {
    if (isResizing.current) {
      isResizing.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (minimized) return null;

  const AppComponent = app?.component;

  let windowStyle = {
    transform: `translate3d(${x}px, ${y}px, 0)`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex,
  };

  if (maximized) {
    windowStyle = {
      top: 0,
      left: 0,
      width: '100vw',
      height: 'calc(100vh - 80px)',
      zIndex,
      borderRadius: 0,
    };
  } else if (snapState === 'left') {
    windowStyle = {
      top: 0,
      left: 0,
      width: '50vw',
      height: 'calc(100vh - 80px)',
      zIndex,
      borderRadius: '0 8px 8px 0',
    };
  } else if (snapState === 'right') {
    windowStyle = {
      top: 0,
      left: '50vw',
      width: '50vw',
      height: 'calc(100vh - 80px)',
      zIndex,
      borderRadius: '8px 0 0 8px',
    };
  }

  const isSnapped = maximized || snapState !== 'none';

  return (
    <div
      className={`${styles.window} ${isFocused ? styles.focused : ''} ${isSnapped ? styles.maximized : ''}`}
      style={windowStyle}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={styles.titleBar}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onDoubleClick={() => toggleMaximize(id)}
      >
        <div className={styles.titleText}>
          <span className={styles.dotIcon}>•</span>
          <span>{title}</span>
        </div>

        {/* Minimal Controls */}
        <div className={styles.controls}>
          <button
            onClick={() => minimizeWindow(id)}
            className={styles.ctrlBtn}
            title="Minimize"
            aria-label="Minimize"
          >
            —
          </button>
          <button
            onClick={() => toggleMaximize(id)}
            className={styles.ctrlBtn}
            title={isSnapped ? 'Restore' : 'Maximize'}
            aria-label="Maximize"
          >
            {isSnapped ? '❐' : '▢'}
          </button>
          <button
            onClick={() => closeWindow(id)}
            className={`${styles.ctrlBtn} ${styles.closeBtn}`}
            title="Close"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <WindowErrorBoundary>
          {AppComponent ? <AppComponent windowId={id} /> : <div>Application not found</div>}
        </WindowErrorBoundary>
      </div>

      {/* 8-Directional Resizing Handles */}
      {!isSnapped && (
        <>
          <div
            className={`${styles.resizeBorder} ${styles.resizeN}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'n')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeBorder} ${styles.resizeS}`}
            onPointerDown={(e) => handleResizePointerDown(e, 's')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeBorder} ${styles.resizeE}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'e')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeBorder} ${styles.resizeW}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'w')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeCorner} ${styles.resizeNW}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'nw')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeCorner} ${styles.resizeNE}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'ne')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeCorner} ${styles.resizeSW}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'sw')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
          <div
            className={`${styles.resizeCorner} ${styles.resizeSE}`}
            onPointerDown={(e) => handleResizePointerDown(e, 'se')}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
          />
        </>
      )}
    </div>
  );
}
