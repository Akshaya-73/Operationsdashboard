import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/openweather')
      .then(res => { setWeatherData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading Weather Data...</div>;
  if (!weatherData) return <div className="widget-error">Failed to load Weather data. Check API Key.</div>;

  const temp = weatherData.main.temp;
  const description = weatherData.weather[0].description;
  const isSevere = temp > 40 || temp < 10; // Severe weather logic

  return (
    <section className="glass-card" aria-label="Business Continuity Weather Widget">
      <h3 className="widget-header" style={{ color: '#67e8f9' }}>⛈️ Business Continuity (Hyd)</h3>
      
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <p style={{ fontSize: '42px', fontWeight: '800', color: '#ffffff', margin: '0' }}>
          {temp.toFixed(0)}°C
        </p>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '5px 0', textTransform: 'capitalize' }}>
          {description}
        </p>
        {isSevere && (
          <span className="alert-badge">🔴 ALERT: Business Continuity SOP</span>
        )}
      </div>

      <p className="timestamp">
  Last Updated: {weatherData?.isMock ? "🟡 Demo Mode (Check API Key)" : "Cached (30m TTL)"}
</p>
    </section>
  );
}