import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RedditWidget() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reddit')
      .then(res => {
        const children = res.data.data?.children || [];
        setPosts(children);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading Reddit Data...</div>;
  if (!posts.length) return <div className="widget-error">Failed to load Reddit data</div>;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#ff6b6b' }}>💬 Reddit Sentiment (r/Entrepreneur)</h3>
      
      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {posts.map((post, i) => (
          <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #334155' }}>
            <p style={{ margin: '0', fontSize: '13px', color: '#ffffff' }}>
              {post.data.title}
            </p>
            <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
              ⬆️ {post.data.ups} upvotes | 💬 {post.data.num_comments} comments
            </p>
          </div>
        ))}
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (15m TTL)</p>
    </div>
  );
}