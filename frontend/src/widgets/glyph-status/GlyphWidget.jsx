import React, { useState, useEffect } from 'react';
import { Activity, BatteryCharging, Cpu, Zap } from 'lucide-react';
import styles from './GlyphWidget.module.css';

export default function GlyphWidget() {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 16);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Zap size={14} className={styles.accentIcon} />
          <span className={styles.title}>GLYPH INTERFACE (V1)</span>
        </div>
        <span className={styles.statusLive}>SYS • ONLINE</span>
      </div>

      {/* Segmented Glyph Strip */}
      <div className={styles.strip}>
        {Array.from({ length: 16 }).map((_, index) => {
          const isActive = index === pulseIndex || index === (pulseIndex + 1) % 16;
          return (
            <div
              key={index}
              className={`${styles.segment} ${isActive ? styles.segmentPulse : ''}`}
            />
          );
        })}
      </div>

      {/* System Telemetry Readouts */}
      <div className={styles.metrics}>
        <div className={styles.metricItem}>
          <Cpu size={12} />
          <span>CPU: 18%</span>
        </div>
        <div className={styles.metricItem}>
          <Activity size={12} />
          <span>RAM: 3.8 / 8 GB</span>
        </div>
        <div className={styles.metricItem}>
          <BatteryCharging size={12} className={styles.accentIcon} />
          <span>BAT: 96%</span>
        </div>
      </div>
    </div>
  );
}
