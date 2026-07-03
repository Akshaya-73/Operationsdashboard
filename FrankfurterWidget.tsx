import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FrankfurterWidget() {
  const [fxData, setFxData] = useState<any[]>([]);
  const [latestRate, setLatestRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFxData();
  }, []);

   const fetchFxData = async () => {
    try {
      // CALLING OUR BACKEND CACHE SERVER!
      const response = await axios.get('http://localhost:5000/api/frankfurter');
      
      const ratesData = response.data?.rates || {};
      const chartData = Object.keys(ratesData).map(date => ({
        date: date.slice(5),
        rate: ratesData[date]?.INR || 0
      }));

      setFxData(chartData);
      if (chartData.length > 0) {
        setLatestRate(chartData[chartData.length - 1].rate);
      }
      setLoading(false);
    } catch (error) {
      console.error("FX Backend failed!", error);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', color: '#94a3b8' }}>Loading FX Data...</div>;
  if (!fxData.length) return <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', color: 'red' }}>Failed to load FX data</div>;

  // SOP TRIGGER LOGIC: USD–client >2% WoW (Week over Week)
  const rateWeekAgo = fxData.length > 7 ? fxData[fxData.length - 8]?.rate : latestRate;
  const wowChange = latestRate && rateWeekAgo ? ((latestRate - rateWeekAgo) / rateWeekAgo) * 100 : 0;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#a78bfa' }}>💱 Cross-border FX Rates (USD → INR)</h3>
      
      {/* KPI Card Section */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '0', color: '#94a3b8', fontSize: '14px' }}>Current Rate</p>
        <p style={{ margin: '5px 0', fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>
          ₹{latestRate?.toFixed(2)}
        </p>
        <p style={{ margin: '0', color: wowChange > 0 ? '#4ade80' : '#f87171', fontSize: '14px' }}>
          WoW Change: {wowChange.toFixed(2)}%
          {Math.abs(wowChange) > 2 && (
            <span style={{ marginLeft: '10px', color: '#f87171', fontWeight: 'bold' }}>
              🔴 ALERT: Cross-border Invoicing SOP!
            </span>
          )}
        </p>
      </div>

      {/* Line Chart Section */}
      <div style={{ height: '200px', marginTop: '20px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={fxData}>
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis domain={['auto', 'auto']} stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Rate']}
            />
            <Line type="monotone" dataKey="rate" stroke="#a78bfa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
        Last Updated: Just now (30-day trend)
      </p>
    </div>
  );
}