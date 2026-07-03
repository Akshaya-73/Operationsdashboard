import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CoinGeckoWidget() {
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  // OLD: const response = await axios.get('https://api.coingecko.com/...');
// NEW: (Copy paste this entire function replacing the old one inside the component)

  const fetchCryptoData = async () => {
    try {
      // CALLING OUR BACKEND CACHE SERVER! NOT DIRECT API!
      const response = await axios.get('http://localhost:5000/api/coingecko');
      setCryptoData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Backend API failed!", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="widget-card" style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>Loading Crypto Data...</div>;
  if (!cryptoData) return <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', color: 'red' }}>Failed to load data</div>;

  const btcChange = cryptoData.bitcoin?.usd_24h_change || 0;
  const ethChange = cryptoData.ethereum?.usd_24h_change || 0;

    return (
    <div className="glass-card">
      <h3 className="widget-header" style={{ color: '#22d3ee' }}>💰 Treasury Reserve (Crypto)</h3>
      
      {/* Bitcoin */}
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '0', color: '#94a3b8', fontSize: '14px' }}>Bitcoin (BTC)</p>
        <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
          ${cryptoData.bitcoin?.usd?.toLocaleString()}
        </p>
        <p style={{ margin: '0', color: btcChange > 0 ? '#4ade80' : '#f87171', fontSize: '14px' }}>
          24h: {btcChange.toFixed(2)}%
          {Math.abs(btcChange) > 10 && (
            <span className="alert-badge">🔴 ALERT: Treasury SOP</span>
          )}
        </p>
      </div>

      {/* Ethereum */}
      <div>
        <p style={{ margin: '0', color: '#94a3b8', fontSize: '14px' }}>Ethereum (ETH)</p>
        <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
          ${cryptoData.ethereum?.usd?.toLocaleString()}
        </p>
        <p style={{ margin: '0', color: ethChange > 0 ? '#4ade80' : '#f87171', fontSize: '14px' }}>
          24h: {ethChange.toFixed(2)}%
          {Math.abs(ethChange) > 10 && (
             <span className="alert-badge">🔴 ALERT: Treasury SOP</span>
          )}
        </p>
      </div>

      <p className="timestamp">Last Updated: Just now</p>
    </div>
  );
}