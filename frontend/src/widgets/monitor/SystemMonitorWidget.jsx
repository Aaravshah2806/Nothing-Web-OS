import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Battery, Gauge } from 'lucide-react';
import { api } from '../../lib/apiClient';
import styles from './SystemMonitorWidget.module.css';

const MODES = ['RAM', 'CPU', 'STORAGE', 'BATTERY'];

export default function SystemMonitorWidget() {
  const [modeIdx, setModeIdx] = useState(0);
  const [stats, setStats] = useState({
    ramUsedPct: 56,
    ramUsedGB: '9.0',
    ramTotalGB: '16.0',
    cpuPct: 34,
    cpuModel: '8 CORES',
    storagePct: 62,
    storageFreeGB: '198 GB',
    batteryPct: 92,
    isCharging: true,
  });

  const currentMode = MODES[modeIdx];

  // Fetch real system telemetry
  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      // 1. Backend Express system telemetry
      try {
        const res = await api.systemTelemetry();
        if (isMounted && res && res.data) {
          const d = res.data;
          setStats((prev) => ({
            ...prev,
            ramUsedPct: d.ram?.percentUsed ?? prev.ramUsedPct,
            ramUsedGB: d.ram ? (d.ram.used / 1024 / 1024 / 1024).toFixed(1) : prev.ramUsedGB,
            ramTotalGB: d.ram ? (d.ram.total / 1024 / 1024 / 1024).toFixed(1) : prev.ramTotalGB,
            cpuPct: d.cpu?.usagePct ?? prev.cpuPct,
            cpuModel: d.cpu?.cores ? `${d.cpu.cores} CORES` : prev.cpuModel,
          }));
          return;
        }
      } catch {}

      // 2. Browser navigator APIs fallback
      if (performance && performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.jsHeapSizeLimit;
        if (total > 0) {
          const pct = Math.round((used / total) * 100);
          setStats((prev) => ({ ...prev, ramUsedPct: pct }));
        }
      }

      if ('getBattery' in navigator) {
        navigator.getBattery().then((bat) => {
          if (isMounted) {
            setStats((prev) => ({
              ...prev,
              batteryPct: Math.round(bat.level * 100),
              isCharging: bat.charging,
            }));
          }
        }).catch(() => {});
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCycleMode = () => {
    setModeIdx((prev) => (prev + 1) % MODES.length);
  };

  // Determine current active percentage & labels based on selected mode
  let pct = stats.ramUsedPct;
  let subValue = `${stats.ramUsedGB}/${stats.ramTotalGB} GB`;
  let ModeIcon = Gauge;

  if (currentMode === 'CPU') {
    pct = stats.cpuPct;
    subValue = stats.cpuModel;
    ModeIcon = Cpu;
  } else if (currentMode === 'STORAGE') {
    pct = stats.storagePct;
    subValue = `${stats.storageFreeGB} FREE`;
    ModeIcon = HardDrive;
  } else if (currentMode === 'BATTERY') {
    pct = stats.batteryPct;
    subValue = stats.isCharging ? 'AC CHARGING' : 'BATTERY DISCHARGE';
    ModeIcon = Battery;
  }

  // SVG circular gauge geometry (radius 24)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div
      onClick={handleCycleMode}
      className={styles.monitorPill}
      title={`Nothing OS System Monitor (NThing-UI) — Click to switch: ${currentMode}`}
    >
      {/* Left Circular Gauge */}
      <div className={styles.circleWrap}>
        <svg className={styles.progressSvg} width="60" height="60" viewBox="0 0 60 60">
          <circle
            className={styles.trackCircle}
            cx="30"
            cy="30"
            r={radius}
            strokeWidth="5"
          />
          <circle
            className={styles.progressRing}
            cx="30"
            cy="30"
            r={radius}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 30 30)"
          />
        </svg>
        <div className={styles.iconInside}>
          <ModeIcon size={14} className={styles.modeIcon} />
        </div>
      </div>

      {/* Right Column: Percentage & Red Label */}
      <div className={styles.textColumn}>
        <div className={styles.pctRow}>
          <span className={styles.pctNumber}>{pct}</span>
          <span className={styles.pctSign}>%</span>
        </div>
        <span className={styles.labelBadge}>{currentMode}</span>
        <span className={styles.subText}>{subValue}</span>
      </div>
    </div>
  );
}
