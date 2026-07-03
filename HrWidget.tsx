import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HrWidget() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/randomuser')
      .then(res => {
        setUsers(res.data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading HR Data...</div>;
  if (!users.length) return <div className="widget-error">Failed to load HR data</div>;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#c084fc' }}>👥 HR Directory (Mock)</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
        {users.map((user, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '8px', borderRadius: '8px' }}>
            <img src={user.picture.thumbnail} alt="avatar" style={{ borderRadius: '50%', width: '35px', height: '35px' }} />
            <div>
              <p style={{ margin: '0', fontSize: '12px', color: '#ffffff' }}>{user.name.first} {user.name.last}</p>
              <p style={{ margin: '0', fontSize: '10px', color: '#94a3b8' }}>{user.location.country}</p>
            </div>
          </div>
        ))}
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (24h TTL)</p>
    </div>
  );
}