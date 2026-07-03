import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function WorldBankWidget() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/worldbank')
      .then(res => {
        // World Bank returns [pagination, data_array]
        const rawData = res.data[1] || [];
        const formatted = rawData.filter((d: any) => d.value !== null).map((d: any) => ({
          country: d.country.id,
          year: d.date,
          value: Math.round(d.value / 1e9) // Convert to Billions for readability
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading Macro Data...</div>;
  if (!data.length) return <div className="widget-error">Failed to load World Bank data</div>;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#f472b6' }}>🌍 Macro Indicators (GDP in Billion$)</h3>
      
      <div style={{ height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="country" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
            <Bar dataKey="value" fill="#f472b6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (24h TTL)</p>
    </div>
  );
}