import React, { useRef } from 'react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { WIDGET_REGISTRY } from '../../widgets/widgetRegistry';
import styles from './WidgetGrid.module.css';

function DraggableWidgetWrapper({ widgetData }) {
  const { id, widgetId, x, y } = widgetData;
  const updateWidgetPosition = useDesktopStore((state) => state.updateWidgetPosition);

  const isDragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, initX: 0, initY: 0 });

  const handlePointerDown = (e) => {
    // Don't drag if interacting with inputs, buttons, textareas
    if (['INPUT', 'BUTTON', 'TEXTAREA', 'A'].includes(e.target.tagName)) return;

    isDragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      initX: x,
      initY: y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;

    // Grid snapping (8px grid discipline per Design Plan)
    const rawX = dragStart.current.initX + dx;
    const rawY = dragStart.current.initY + dy;
    const snappedX = Math.round(rawX / 8) * 8;
    const snappedY = Math.round(rawY / 8) * 8;

    const clampedX = Math.max(16, Math.min(window.innerWidth - 300, snappedX));
    const clampedY = Math.max(16, Math.min(window.innerHeight - 200, snappedY));

    updateWidgetPosition(id, clampedX, clampedY);
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const widgetDef = WIDGET_REGISTRY[widgetId];
  if (!widgetDef) return null;
  const Component = widgetDef.component;

  return (
    <div
      className={styles.draggableContainer}
      style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Component />
    </div>
  );
}

export default function WidgetGrid() {
  const activeWidgets = useDesktopStore((state) => state.activeWidgets);

  return (
    <div className={styles.widgetGridLayer}>
      {activeWidgets.map((w) => (
        <DraggableWidgetWrapper key={w.id} widgetData={w} />
      ))}
    </div>
  );
}
