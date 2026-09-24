import React, { useRef, useState, useEffect } from 'react';
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
  } = windowData;

  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    focusedWindowId,
  } = useWindowStore();

  const isFocused = focusedWindowId === id;
  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, initX: 0, initY: 0 });

  const isResizing = useRef(false);
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, initW: 0, initH: 0 });

  const handleTitlePointerDown = (e) => {
    if (maximized) return;
    if (e.target.closest('button')) return;

    focusWindow(id);
    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: x,
      initY: y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleTitlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    const newX = Math.max(0, Math.min(window.innerWidth - 100, dragStart.current.initX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.initY + dy));

    moveWindow(id, newX, newY);
  };

  const handleTitlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleResizePointerDown = (e) => {
    if (maximized) return;
    e.stopPropagation();
    focusWindow(id);
    isResizing.current = true;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initW: width,
      initH: height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e) => {
    if (!isResizing.current) return;
    const dw = e.clientX - resizeStart.current.mouseX;
    const dh = e.clientY - resizeStart.current.mouseY;

    resizeWindow(id, resizeStart.current.initW + dw, resizeStart.current.initH + dh);
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

  const windowStyle = maximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 80px)',
        zIndex,
        borderRadius: 0,
      }
    : {
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
      };

  return (
    <div
      className={`${styles.window} ${isFocused ? styles.focused : ''} ${maximized ? styles.maximized : ''}`}
      style={windowStyle}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Nothing OS Minimal Title Bar */}
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

        {/* Minimalist Controls: — ▢ × */}
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
            title={maximized ? 'Restore' : 'Maximize'}
            aria-label="Maximize"
          >
            {maximized ? '❐' : '▢'}
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

      {/* Window Body */}
      <div className={styles.body}>
        <WindowErrorBoundary>
          {AppComponent ? <AppComponent windowId={id} /> : <div>Application not found</div>}
        </WindowErrorBoundary>
      </div>

      {/* Resize Handle */}
      {!maximized && (
        <div
          className={styles.resizeHandle}
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
        />
      )}
    </div>
  );
}
