import React, { useState, useEffect } from 'react';
import styles from './DateWidget.module.css';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const DAY_NAMES = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

export default function DateWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const dateNum = now.getDate();
  const monthStr = MONTH_NAMES[now.getMonth()];
  const dayStr = DAY_NAMES[now.getDay()];

  // Calculate percentage of 24h day elapsed
  const totalMinutesInDay = 24 * 60;
  const currentMinutes = hours * 60 + minutes;
  const dayPercentage = Math.min(100, Math.max(0, (currentMinutes / totalMinutesInDay) * 100));

  // SVG circle geometry (radius 24, circumference = 2 * pi * 24 ≈ 150.796)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dayPercentage / 100) * circumference;

  return (
    <div className={styles.datePill} title={`Nothing OS Date Widget — ${Math.round(dayPercentage)}% of day completed`}>
      {/* Left Circular Day Progress & Date */}
      <div className={styles.circleWrap}>
        <svg className={styles.progressSvg} width="60" height="60" viewBox="0 0 60 60">
          {/* Background track circle */}
          <circle
            className={styles.trackCircle}
            cx="30"
            cy="30"
            r={radius}
            strokeWidth="5"
          />
          {/* Active progress ring */}
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
        <span className={styles.dateNumber}>{dateNum}</span>
      </div>

      {/* Right Column: Month & Day */}
      <div className={styles.textColumn}>
        <span className={styles.monthText}>{monthStr}</span>
        <span className={styles.dayText}>{dayStr}</span>
      </div>
    </div>
  );
}
