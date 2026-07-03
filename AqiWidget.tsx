import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AqiWidget() {
  const [aqiData, setAqiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/aqi')
      .then(res => {
        setAqiData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading AQI Data...</div>;
  if (!aqiData) return <div className="widget-error">Failed to load AQI data</div>;

  const pm25 = aqiData.current?.pm2_5 || 0;
  const pm10 = aqiData.current?.pm10 || 0;
  
  // SOP TRIGGER: WFH Advisory if AQI > 200 (PM2.5 > 150 is unhealthy)
  const isDangerous = pm25 > 150;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#67e8f9' }}>🌫️ Air Quality (Hyderabad)</h3>
      
      <div style={{ textAlign: 'center', padding: '20px', background: isDangerous ? '#7f1d1d' : '#1e293b', borderRadius: '12px', border: `2px solid ${isDangerous ? '#ef4444' : '#334155'}` }}>
        <p style={{ margin: '0', fontSize: '48px', fontWeight: 'bold', color: isDangerous ? '#fca5a5' : '#ffffff' }}>
          {Math.round(pm25)}
        </p>
        <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>PM2.5 Level</p>
        
        {isDangerous && (
          <div style={{ marginTop: '15px', color: '#f87171', fontWeight: 'bold' }}>
            🔴 ALERT: WFH Advisory SOP!
          </div>
        )}
      </div>

      <p style={{ marginTop: '15px', color: '#94a3b8', fontSize: '14px' }}>PM10 Level: {Math.round(pm10)}</p>
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (30m TTL)</p>
    </div>
  );
}