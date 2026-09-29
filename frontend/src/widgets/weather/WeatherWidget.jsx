import React, { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import styles from './WeatherWidget.module.css';

const WMO_CONDITIONS = {
  0: 'CLEAR SKY',
  1: 'MAINLY CLEAR',
  2: 'PARTLY CLOUDY',
  3: 'OVERCAST',
  45: 'FOGGY',
  48: 'RIME FOG',
  51: 'LIGHT DRIZZLE',
  53: 'DRIZZLE',
  55: 'HEAVY DRIZZLE',
  61: 'LIGHT RAIN',
  63: 'MODERATE RAIN',
  65: 'HEAVY RAIN',
  71: 'LIGHT SNOW',
  73: 'MODERATE SNOW',
  75: 'HEAVY SNOW',
  80: 'RAIN SHOWERS',
  81: 'HEAVY SHOWERS',
  82: 'VIOLENT RAIN',
  95: 'THUNDERSTORM',
  96: 'HAIL STORM',
  99: 'SEVERE THUNDER',
};

// Map WMO weather code to authentic NThing-UI dot-matrix weather icon number
function getNothingIconId(wmoCode, isDay = true) {
  switch (wmoCode) {
    case 0:
      return isDay ? 32 : 31;
    case 1:
    case 2:
      return isDay ? 30 : 29;
    case 3:
      return 26;
    case 45:
    case 48:
      return 20;
    case 51:
    case 53:
    case 55:
      return 9;
    case 61:
    case 63:
    case 65:
      return 12;
    case 71:
    case 73:
    case 75:
      return 16;
    case 80:
    case 81:
    case 82:
      return 40;
    case 85:
    case 86:
      return 42;
    case 95:
    case 96:
    case 99:
      return 4;
    default:
      return 32;
  }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'CLEAR SKY',
    wind: '8 KM/H',
    location: 'DELHI',
    iconId: 32,
  });

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      // 1. Backend cached proxy
      try {
        const res = await api.weather('DELHI');
        if (isMounted && res && res.data) {
          const isDay = new Date().getHours() >= 6 && new Date().getHours() < 19;
          setWeather({
            temp: res.data.temp,
            condition: res.data.condition.toUpperCase(),
            wind: `${res.data.windSpeed} KM/H`,
            location: 'DELHI',
            iconId: getNothingIconId(res.data.weatherCode || 0, isDay),
          });
          return;
        }
      } catch {}

      // 2. Direct browser Open-Meteo fallback
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true'
        );
        const data = await res.json();
        if (isMounted && data && data.current_weather) {
          const cur = data.current_weather;
          const code = cur.weathercode ?? 0;
          const isDay = cur.is_day !== undefined ? Boolean(cur.is_day) : true;
          setWeather({
            temp: Math.round(cur.temperature),
            condition: WMO_CONDITIONS[code] || 'PARTLY CLOUDY',
            wind: `${Math.round(cur.windspeed)} KM/H`,
            location: 'DELHI',
            iconId: getNothingIconId(code, isDay),
          });
        }
      } catch (e) {
        console.debug('Weather fetch fallback error', e);
      }
    };

    loadWeather();
    const interval = setInterval(loadWeather, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.weatherPill} title={`Nothing OS Weather — ${weather.condition} (${weather.location})`}>
      {/* Left Circular Frame with authentic NThing dot-matrix weather icon */}
      <div className={styles.iconCircle}>
        <img
          src={`/weather-icons/${weather.iconId}.png`}
          alt={weather.condition}
          className={styles.weatherIconImg}
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = '/weather-icons/32.png';
          }}
        />
      </div>

      {/* Right Column: Temperature, Condition & City */}
      <div className={styles.textColumn}>
        <div className={styles.tempRow}>
          <span className={styles.tempValue}>{weather.temp}</span>
          <span className={styles.tempUnit}>°C</span>
        </div>
        <span className={styles.conditionText}>{weather.condition}</span>
        <div className={styles.subRow}>
          <span>{weather.location}</span>
          <span>•</span>
          <span>{weather.wind}</span>
        </div>
      </div>
    </div>
  );
}
