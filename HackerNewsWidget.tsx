import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HackerNewsWidget() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hackernews')
      .then(res => {
        setStories(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="widget-loading">Loading HN Stories...</div>;
  if (!stories.length) return <div className="widget-error">Failed to load HN data</div>;

  return (
    <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#fb923c' }}>📰 Top Hacker News</h3>
      
      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {stories.map((story, index) => (
          <div key={story.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #334155' }}>
            <p style={{ margin: '0', color: '#ffffff', fontSize: '14px' }}>
              {index + 1}. {story.title}
            </p>
            <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
              ⬆️ {story.score} points | By: {story.by}
            </p>
          </div>
        ))}
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>Last Updated: Cached (10m TTL)</p>
    </div>
  );
}