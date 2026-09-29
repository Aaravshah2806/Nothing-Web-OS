import React, { useState, useEffect } from 'react';
import { Activity, BatteryCharging, Cpu, Zap, Database } from 'lucide-react';
import { api } from '../../lib/apiClient';
import styles from './GlyphWidget.module.css';

export default function GlyphWidget() {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(96);
  const [isCharging, setIsCharging] = useState(true);
  const [memoryUsage, setMemoryUsage] = useState('3.8 / 8 GB');
  const [cpuUsage, setCpuUsage] = useState('18%');
  const [dbStatus, setDbStatus] = useState('LOCAL');

  useEffect(() => {
    // Pulse animation timer
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 16);
    }, 180);

    // Live Battery API check
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    // Live backend telemetry with offline fallback
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const res = await api.telemetry();
        if (isMounted && res && res.telemetry) {
          const t = res.telemetry;
          setMemoryUsage(`${t.memory.usedGB} / ${t.memory.totalGB} GB`);
          setCpuUsage(`${t.memory.percentUsed}%`);
          setDbStatus(t.database.status === 'connected' ? 'MONGO • ON' : 'OFFLINE');
        }
      } catch {
        // Fallback to browser performance API if backend offline
        if (typeof performance !== 'undefined' && performance.memory) {
          const usedMB = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
          const totalMB = Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024));
          setMemoryUsage(`${(usedMB / 1024).toFixed(1)} / ${(totalMB / 1024).toFixed(1)} GB`);
        }
      }
    };

    fetchTelemetry();
    const telemetryInterval = setInterval(fetchTelemetry, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(telemetryInterval);
    };
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
          <span>CPU: {cpuUsage}</span>
        </div>
        <div className={styles.metricItem}>
          <Activity size={12} />
          <span>RAM: {memoryUsage}</span>
        </div>
        <div className={styles.metricItem}>
          <BatteryCharging size={12} className={isCharging ? styles.accentIcon : ''} />
          <span>BAT: {batteryLevel}% {isCharging ? '⚡' : ''}</span>
        </div>
        <div className={styles.metricItem}>
          <Database size={12} className={dbStatus.includes('ON') ? styles.accentIcon : ''} />
          <span>{dbStatus}</span>
        </div>
      </div>
    </div>
  );
}
