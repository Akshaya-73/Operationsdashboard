import { useState, useEffect } from 'react';
import axios from 'axios';

export default function WhoWidget() {
  const [facts, setFacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/who')
      .then(res => {
        const topFacts = res.data.value.slice(0, 5); // Just top 5 for the widget
        setFacts(topFacts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading WHO Data...</div>;
  if (!facts.length) return <div className="widget-error">Failed to load WHO data</div>;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#4ade80' }}>🏥 Health Indicators (WHO)</h3>
      
      {/* Simulating Heatmap with color-coded blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {facts.map((fact, i) => {
          const value = fact.Value ?? 0;
          const isHigh = value > 30; // Simple threshold logic
          return (
            <div key={i} style={{ background: isHigh ? '#7f1d1d' : '#14532d', padding: '10px', borderRadius: '8px' }}>
              <p style={{ margin: '0', fontSize: '12px', color: '#d4d4d8' }}>{fact.SpatialDim}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
                {value}%
              </p>
              {isHigh && <p style={{ margin: '2px 0 0 0', color: '#f87171', fontSize: '10px' }}>🔴 Compliance Audit</p>}
            </div>
          );
        })}
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (24h TTL)</p>
    </div>
  );
}