import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import styles from './CalendarWidget.module.css';

export default function CalendarWidget() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  // Calculate calendar grid
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const weekHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <CalendarIcon size={14} className={styles.accentIcon} />
          <span className={styles.monthTitle}>
            {monthNames[currentMonth]} {currentYear}
          </span>
        </div>
      </div>

      <div className={styles.weekHeader}>
        {weekHeaders.map((d, index) => (
          <span key={index} className={styles.weekDay}>{d}</span>
        ))}
      </div>

      <div className={styles.daysGrid}>
        {days.map((day, idx) => {
          const isToday = day === currentDate;
          return (
            <div key={idx} className={styles.dayCell}>
              {day !== null ? (
                <span className={`${styles.dayNumber} ${isToday ? styles.todayCell : ''}`}>
                  {day}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
