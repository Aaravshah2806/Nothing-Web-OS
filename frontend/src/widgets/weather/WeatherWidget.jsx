import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, CloudRain, Sun, CloudFog } from 'lucide-react';
import styles from './WeatherWidget.module.css';

const WMO_CONDITIONS = {
  0: 'CLEAR SKY',
  1: 'MAINLY CLEAR',
  2: 'PARTLY CLOUDY',
  3: 'OVERCAST',
  45: 'FOGGY',
  48: 'DEPOSITING RIME FOG',
  51: 'LIGHT DRIZZLE',
  61: 'RAIN SHOWERS',
  63: 'MODERATE RAIN',
  65: 'HEAVY RAIN',
  71: 'LIGHT SNOW',
  95: 'THUNDERSTORM',
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 21,
    condition: 'SCATTERED CLOUDS',
    wind: '14 KM/H',
    location: 'LONDON, UK',
    code: 2,
  });

  useEffect(() => {
    const fetchWeather = async (lat = 51.5074, lon = -0.1278, locName = 'LONDON, UK') => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        if (data && data.current_weather) {
          const cur = data.current_weather;
          setWeather({
            temp: Math.round(cur.temperature),
            condition: WMO_CONDITIONS[cur.weathercode] || 'PARTLY CLOUDY',
            wind: `${Math.round(cur.windspeed)} KM/H`,
            location: locName,
            code: cur.weathercode,
          });
        }
      } catch (e) {
        console.debug('Weather fetch fallback', e);
      }
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude, 'LOCAL STATION');
        },
        () => fetchWeather(51.5074, -0.1278, 'LONDON, UK'),
        { timeout: 4000 }
      );
    } else {
      fetchWeather(51.5074, -0.1278, 'LONDON, UK');
    }
  }, []);

  const WeatherIcon =
    weather.code === 0
      ? Sun
      : [61, 63, 65, 51].includes(weather.code)
      ? CloudRain
      : [45, 48].includes(weather.code)
      ? CloudFog
      : CloudSun;

  return (
    <div className={styles.widget}>
      <div className={styles.topRow}>
        <div className={styles.locationBlock}>
          <span className={styles.city}>{weather.location}</span>
          <span className={styles.condition}>{weather.condition}</span>
        </div>
        <WeatherIcon size={28} className={styles.weatherIcon} />
      </div>

      <div className={styles.tempRow}>
        <span className={styles.tempDigit}>{weather.temp}</span>
        <span className={styles.tempUnit}>°C</span>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <Wind size={12} />
          <span>{weather.wind}</span>
        </div>
        <div className={styles.metric}>
          <Droplets size={12} />
          <span>LIVE • 1013 HPA</span>
        </div>
      </div>
    </div>
  );
}
