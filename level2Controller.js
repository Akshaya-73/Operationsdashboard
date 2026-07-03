const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

// ==========================================
// B3 - NEWSAPI (Header: X-Api-Key)
// ==========================================
exports.getNews = async (req, res) => {
  if (!process.env.NEWSAPI_KEY) return res.status(500).json({ error: 'NEWSAPI_KEY missing in .env' });
  const cacheKey = 'newsapi_v2';
    const cached = await getCache(cacheKey, 900);
  if (cached) return res.json(cached);
  try {
const response = await axios.get('https://newsapi.org/v2/everything?q=India+business+tech&sortBy=publishedAt&pageSize=15', {      headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch NewsAPI data' }); }
};

// ==========================================
// B4 - FRED (Query Key)
// ==========================================
exports.getFRED = async (req, res) => {
  if (!process.env.FRED_KEY) return res.status(500).json({ error: 'FRED_KEY missing in .env' });
  const cacheKey = 'fred_cpi';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${process.env.FRED_KEY}&file_type=json&sort_order=desc&limit=30`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch FRED data' }); }
};

// ==========================================
// B5 - USAJOBS (Headers: Authorization-Key + User-Agent)
// ==========================================
exports.getUSAJobs = async (req, res) => {
  if (!process.env.USAJOBS_KEY) return res.status(500).json({ error: 'USAJOBS_KEY missing in .env' });
  const cacheKey = 'usajobs_search';
  const cached = await getCache(cacheKey, 1800);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://data.usajobs.gov/api/Search?Keyword=compliance', {
      headers: { 
        'Authorization-Key': process.env.USAJOBS_KEY,
        'User-Agent': process.env.USAJOBS_EMAIL || 'your_email@gmail.com'
      }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch USAJOBS data' }); }
};

// ==========================================
// B6 - CLOCKIFY (Header: X-Api-Key)
// ==========================================
exports.getClockify = async (req, res) => {
  if (!process.env.CLOCKIFY_KEY) return res.status(500).json({ error: 'CLOCKIFY_KEY missing in .env' });
  const cacheKey = 'clockify_entries';
  const cached = await getCache(cacheKey, 600);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get(`https://api.clockify.me/api/v1/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/time-entries`, {
      headers: { 'X-Api-Key': process.env.CLOCKIFY_KEY }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch Clockify data' }); }
};

// ==========================================
// B7 - NOTION (Headers: Bearer + Notion-Version) - POST REQUEST
// ==========================================
exports.getNotion = async (req, res) => {
  if (!process.env.NOTION_KEY) return res.status(500).json({ error: 'NOTION_KEY missing in .env' });
  const cacheKey = 'notion_sops';
  const cached = await getCache(cacheKey, 900);
  if (cached) return res.json(cached);
  try {
    const response = await axios.post(`https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`, {}, {
      headers: { 
        'Authorization': `Bearer ${process.env.NOTION_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch Notion data' }); }
};

// ==========================================
// B8 - AIRTABLE (Header: Bearer PAT)
// ==========================================
exports.getAirtable = async (req, res) => {
  if (!process.env.AIRTABLE_KEY) return res.status(500).json({ error: 'AIRTABLE_KEY missing in .env' });
  const cacheKey = 'airtable_clients';
  const cached = await getCache(cacheKey, 600);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`, {
      headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_KEY}` }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch Airtable data' }); }
};

// ==========================================
// B9 - TRELLO (Query: key + token)
// ==========================================
exports.getTrello = async (req, res) => {
  if (!process.env.TRELLO_KEY) return res.status(500).json({ error: 'TRELLO_KEY missing in .env' });
  const cacheKey = 'trello_cards';
  const cached = await getCache(cacheKey, 300);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get(`https://api.trello.com/1/boards/${process.env.TRELLO_BOARD_ID}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { 
    console.error("❌ Trello Error Details:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Trello data', details: error.response?.data || error.message }); 
  }};

// ==========================================
// B10 - AQICN (Query: token)
// ==========================================
exports.getAQICN = async (req, res) => {
  if (!process.env.AQICN_TOKEN) return res.status(500).json({ error: 'AQICN_TOKEN missing in .env' });
  const cacheKey = 'aqicn_hyderabad';
  const cached = await getCache(cacheKey, 900);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get(`https://api.waqi.info/feed/hyderabad/?token=${process.env.AQICN_TOKEN}`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch AQICN data' }); }
};