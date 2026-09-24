import React from 'react';
import { CloudSun, Wind, Droplets } from 'lucide-react';
import styles from './WeatherWidget.module.css';

export default function WeatherWidget() {
  return (
    <div className={styles.widget}>
      <div className={styles.topRow}>
        <div className={styles.locationBlock}>
          <span className={styles.city}>LONDON, UK</span>
          <span className={styles.condition}>SCATTERED CLOUDS</span>
        </div>
        <CloudSun size={28} className={styles.weatherIcon} />
      </div>

      <div className={styles.tempRow}>
        <span className={styles.tempDigit}>21</span>
        <span className={styles.tempUnit}>°C</span>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <Wind size={12} />
          <span>14 KM/H</span>
        </div>
        <div className={styles.metric}>
          <Droplets size={12} />
          <span>62% HUM</span>
        </div>
      </div>
    </div>
  );
}
