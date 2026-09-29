// In-memory weather cache (15-minute TTL) to avoid hitting external rate limits
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

const WEATHER_CODE_MAP = {
  0: { condition: 'Clear Sky', icon: 'sun' },
  1: { condition: 'Mainly Clear', icon: 'sun-dim' },
  2: { condition: 'Partly Cloudy', icon: 'cloud-sun' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'cloud-fog' },
  48: { condition: 'Rime Fog', icon: 'cloud-fog' },
  51: { condition: 'Light Drizzle', icon: 'cloud-drizzle' },
  53: { condition: 'Moderate Drizzle', icon: 'cloud-drizzle' },
  55: { condition: 'Dense Drizzle', icon: 'cloud-drizzle' },
  61: { condition: 'Slight Rain', icon: 'cloud-rain' },
  63: { condition: 'Moderate Rain', icon: 'cloud-rain' },
  65: { condition: 'Heavy Rain', icon: 'cloud-rain' },
  71: { condition: 'Slight Snow', icon: 'cloud-snow' },
  73: { condition: 'Moderate Snow', icon: 'cloud-snow' },
  75: { condition: 'Heavy Snow', icon: 'cloud-snow' },
  80: { condition: 'Rain Showers', icon: 'cloud-rain' },
  95: { condition: 'Thunderstorm', icon: 'cloud-lightning' },
};

export const getWeather = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 28.6139; // Default New Delhi / configurable
    const lon = parseFloat(req.query.lon) || 77.2090;
    const city = req.query.city || 'DELHI';

    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = weatherCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({
        success: true,
        source: 'cache',
        data: cached.data,
      });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open-Meteo upstream error: ${response.statusText}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const code = current.weather_code ?? 0;
    const meta = WEATHER_CODE_MAP[code] || { condition: 'Clear', icon: 'sun' };

    const formattedWeather = {
      city: city.toUpperCase(),
      latitude: lat,
      longitude: lon,
      temp: Math.round(current.temperature_2m ?? 24),
      unit: '°C',
      condition: meta.condition,
      iconType: meta.icon,
      humidity: Math.round(current.relative_humidity_2m ?? 45),
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      high: Math.round(data.daily?.temperature_2m_max?.[0] ?? current.temperature_2m ?? 28),
      low: Math.round(data.daily?.temperature_2m_min?.[0] ?? current.temperature_2m ?? 18),
      updatedAt: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, {
      timestamp: Date.now(),
      data: formattedWeather,
    });

    res.status(200).json({
      success: true,
      source: 'live',
      data: formattedWeather,
    });
  } catch (error) {
    next(error);
  }
};
