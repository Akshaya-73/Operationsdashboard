// @ts-nocheck
import { useState, useEffect } from 'react';
import axios from 'axios';

const boxStyle: any = { border: '1px solid #333', padding: '15px', borderRadius: '8px', backgroundColor: '#1e1e1e', color: '#fff', height: '100%' };
const titleStyle: any = { margin: '0 0 10px 0', fontSize: '14px', color: '#aaa' };

export const NewsWidget = () => {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/news').then(res => setNews(res.data.articles || [])).catch(() => {});
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>📰 Crisis Comms (News)</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {news.slice(0, 5).map((a: any, i: number) => (
          <div key={i} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #333' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ddd' }}>{a.title}</div>
            <div style={{ fontSize: '10px', color: '#666' }}>{a.source?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FredWidget = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/fred').then(res => {
      const obs = res.data.observations;
      const latest = parseFloat(obs[0]?.value);
      const prev = parseFloat(obs[1]?.value);
      const mom = prev ? ((latest - prev) / prev * 100).toFixed(3) : 0;
      setData({ latest, mom: parseFloat(mom), date: obs[0]?.date });
    }).catch(() => {});
  }, []);
  if (!data) return <div style={boxStyle}><h3 style={titleStyle}>📊 Pricing Review (FRED)</h3>Loading...</div>;
  return (
    <div style={{...boxStyle, border: data.mom > 0.3 ? '2px solid red' : '#333'}}>
      <h3 style={titleStyle}>📊 Pricing Review (FRED)</h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.latest}</div>
      <div style={{ fontSize: '12px', color: '#aaa' }}>CPI ({data.date})</div>
      <div style={{ color: data.mom > 0 ? '#ff4d4d' : '#4dff4d', marginTop: '5px' }}>{data.mom > 0 ? '+' : ''}{data.mom}% MoM</div>
      {data.mom > 0.3 && <div style={{ marginTop: '5px', padding: '5px', backgroundColor: '#ff4d4d', borderRadius: '4px', fontSize: '11px' }}>⚠️ TRIGGER: CPI {'>'}0.3%</div>}
    </div>
  );
};

export const USAJobsWidget = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/usajobs').then(res => {
      setJobs(res.data.SearchResult?.SearchResultItems?.slice(0, 5) || []);
    }).catch(() => {});
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>🇺🇸 Capture Mgmt (USAJOBS)</h3>
      {jobs.map((j: any, i: number) => (
        <div key={i} style={{ marginBottom: '5px', fontSize: '12px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          <div style={{ fontWeight: 'bold' }}>{j.MatchedObjectDescriptor?.PositionTitle}</div>
          <div style={{ color: '#888' }}>{j.MatchedObjectDescriptor?.OrganizationName}</div>
        </div>
      ))}
    </div>
  );
};

export const ClockifyWidget = () => {
  const [entries, setEntries] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/clockify').catch(() => {});
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>⏱️ Capacity (Clockify)</h3>
      <div style={{fontSize:'12px', color:'#888'}}>Add Workspace ID in .env</div>
    </div>
  );
};

export const NotionWidget = () => {
  const [sops, setSops] = useState({ Draft: 0, Review: 0, Published: 0, Retired: 0 });
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/notion').then(res => {
      const counts = { Draft: 0, Review: 0, Published: 0, Retired: 0 };
      res.data.results?.forEach((r: any) => {
        const status = r.properties?.Status?.select?.name || 'Draft';
        if ((counts as any)[status] !== undefined) (counts as any)[status]++;
      });
      setSops(counts);
    }).catch(() => {});
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>📝 SOP Refresh (Notion)</h3>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        {Object.entries(sops).map(([status, count]) => (
          <div key={status} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{count}</div>
            <div style={{ fontSize: '10px', color: '#aaa' }}>{status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AirtableWidget = () => {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/airtable').then(res => setClients(res.data.records || [])).catch(() => {});
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>📁 Escalations (Airtable)</h3>
      {clients.length === 0 ? <div style={{fontSize:'12px', color:'#888'}}>Add Airtable Base ID in .env</div> : 
       clients.slice(0, 5).map((c: any, i: number) => (
        <div key={i} style={{ fontSize: '12px', marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
          <span style={{ fontWeight: 'bold' }}>{c.fields?.Name || 'Unknown'}</span>
        </div>
      ))
      }
    </div>
  );
};

export const TrelloWidget = () => {
  const [cards, setCards] = useState<any[]>([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/trello').then(res => setCards(res.data || [])).catch(() => setCards([]));
  }, []);
  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>📋 Workflow (Trello)</h3>
      {cards.length === 0 ? <div style={{fontSize:'12px', color:'#888'}}>Connect Board ID in .env</div> : 
       cards.slice(0, 5).map((c: any, i: number) => (
        <div key={i} style={{ fontSize: '12px', marginBottom: '5px', padding: '5px', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
          {c.name}
        </div>
      ))
      }
    </div>
  );
};

export const AQICNWidget = () => {
  const [aqi, setAqi] = useState<any>(null);
  useEffect(() => {
    axios.get('http://localhost:5000/api/level2/aqicn').then(res => {
      setAqi({ val: res.data.data?.aqi, city: res.data.data?.city?.name });
    }).catch(() => {});
  }, []);
  if (!aqi) return <div style={boxStyle}><h3 style={titleStyle}>🌬️ WFH Advisory (AQICN)</h3>Loading...</div>;
  return (
    <div style={{...boxStyle, border: aqi.val > 150 ? '2px solid red' : '#333'}}>
      <h3 style={titleStyle}>🌬️ WFH Advisory (AQICN)</h3>
      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{aqi.val}</div>
      <div style={{ fontSize: '12px', color: '#aaa' }}>{aqi.city}</div>
      {aqi.val > 150 && <div style={{ marginTop: '5px', padding: '5px', backgroundColor: '#ff4d4d', borderRadius: '4px', fontSize: '11px' }}>⚠️ TRIGGER: AQI {'>'} 150</div>}
    </div>
  );
};