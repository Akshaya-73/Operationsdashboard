import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StockWidget() {
  const [stockData, setStockData] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/alphavantage')
      .then(res => { 
        setStockData(res.data); 
        setLoading(false); 
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="widget-loading">Loading Stock Data...</div>;

  // Safe checking: Alpha Vantage returns 'Global Quote' only if key is valid and limit is not reached
  const quote = stockData?.['Global Quote'];
  const priceString = quote?.['05. price'];
  const changeString = quote?.['10. change percent'];

  // If data is empty, API key might be wrong or Rate Limit (25/day) hit!
  if (error || !quote || !priceString) {
    return (
      <section className="glass-card" aria-label="Stock Market Widget">
        <h3 className="widget-header" style={{ color: '#22d3ee' }}>📈 Investor Update (RELIANCE)</h3>
        <div style={{ padding: '20px 0', textAlign: 'center', color: '#f87171' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Failed to load Stock data</p>
          <p style={{ margin: '0', fontSize: '12px', color: '#94a3b8' }}>
            1. Check if ALPHAVANTAGE_KEY in .env is correct.<br/>
            2. Free tier limit is 25 calls/day.
          </p>
        </div>
        <p className="timestamp">Last Updated: Error</p>
      </section>
    );
  }

  const price = parseFloat(priceString).toFixed(2);
  const change = parseFloat(changeString.replace('%', '')).toFixed(2);
  const isPositive = Number(change) >= 0;

  return (
    <section className="glass-card" aria-label="Stock Market Widget">
      <h3 className="widget-header" style={{ color: '#22d3ee' }}>📈 Investor Update (RELIANCE)</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '0', color: '#94a3b8', fontSize: '14px' }}>Current Price</p>
        <p style={{ margin: '5px 0', fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>
          ₹{price}
        </p>
        <p style={{ margin: '0', color: isPositive ? '#4ade80' : '#f87171', fontSize: '14px' }}>
          Change: {change}%
          {Math.abs(Number(change)) > 5 && (
            <span className="alert-badge">🔴 ALERT: Investor Update SOP</span>
          )}
        </p>
      </div>

      <p className="timestamp">
  Last Updated: {stockData?.isMock ? "🟡 Demo Mode (Check API Key)" : "Cached (24h TTL)"}
</p>
    </section>
  );
}