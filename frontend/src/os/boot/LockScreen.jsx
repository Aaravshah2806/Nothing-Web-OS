import React, { useState, useEffect } from 'react';
import { Lock, ArrowUp, BatteryCharging, Wifi } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import styles from './LockScreen.module.css';

export default function LockScreen() {
  const [time, setTime] = useState(new Date());
  const { isLocked, setLocked } = useDesktopStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isLocked) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        setLocked(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, setLocked]);

  if (!isLocked) return null;

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');

  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const dayStr = `${days[time.getDay()]}, ${time.getDate()} ${months[time.getMonth()]}`;

  return (
    <div className={styles.overlay} onClick={() => setLocked(false)}>
      <div className={styles.topStatus}>
        <div className={styles.statusLeft}>
          <span className={styles.osLogo}>GLYPH OS (1)</span>
        </div>
        <div className={styles.statusRight}>
          <Wifi size={14} />
          <BatteryCharging size={14} className={styles.accentColor} />
          <span className={styles.batText}>96%</span>
        </div>
      </div>

      <div className={styles.centerClock}>
        <div className={styles.timeDisplay}>
          <span>{hours}</span>
          <span className={styles.colon}>:</span>
          <span>{minutes}</span>
        </div>
        <div className={styles.dateDisplay}>{dayStr}</div>
      </div>

      <div className={styles.unlockPrompt}>
        <div className={styles.unlockArrow}>
          <ArrowUp size={18} />
        </div>
        <span className={styles.unlockText}>CLICK OR PRESS ENTER TO UNLOCK</span>
      </div>
    </div>
  );
}
