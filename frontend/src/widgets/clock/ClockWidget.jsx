import React, { useState, useEffect } from 'react';
import styles from './ClockWidget.module.css';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const dayName = days[time.getDay()];
  const monthName = months[time.getMonth()];
  const dateNum = String(time.getDate()).padStart(2, '0');
  const year = time.getFullYear();

  return (
    <div className={styles.widget} title="Nothing OS Clock (NThing-UI)">
      <div className={styles.timeRow}>
        <span className={styles.hourDigit}>{hours}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.minDigit}>{minutes}</span>
        <span className={styles.sec}>{seconds}</span>
      </div>
      <div className={styles.dateRow}>
        <span className={styles.accentBadge}>{dayName}</span>
        <span className={styles.dateText}>{dateNum} {monthName} {year}</span>
      </div>
    </div>
  );
}
