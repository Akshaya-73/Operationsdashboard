const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

exports.getCoinGecko = async (req, res) => {
  const cacheKey = 'coingecko';
  const cached = await getCache(cacheKey, 300);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch CoinGecko data' }); }
};

exports.getCoinGeckoSparkline = async (req, res) => {
  const cacheKey = 'coingecko_sparkline';
  const cached = await getCache(cacheKey, 300);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
    const prices = response.data.prices.map(p => p[1]);
    await setCache(cacheKey, prices);
    res.json(prices);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch sparkline data' }); }
};

exports.getFrankfurter = async (req, res) => {
  const cacheKey = 'frankfurter';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await axios.get(`https://api.frankfurter.dev/v1/${startDate}..${endDate}?from=USD&to=INR`);
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch FX data' }); }
};

exports.getWorldBank = async (req, res) => {
  const cacheKey = 'worldbank';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://api.worldbank.org/v2/country/IND;USA;BRA;GBR/indicator/NY.GDP.MKTP.CD?format=json');
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch World Bank data' }); }
};

exports.getHackerNews = async (req, res) => {
  const cacheKey = 'hackernews';
  const cached = await getCache(cacheKey, 600);
  if (cached) return res.json(cached);
  try {
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const top5Ids = topStoriesRes.data.slice(0, 5);
    const stories = await Promise.all(top5Ids.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
    const storiesData = stories.map(s => s.data);
    await setCache(cacheKey, storiesData);
    res.json(storiesData);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch HN data' }); }
};

exports.getWHO = async (req, res) => {
  const cacheKey = 'who';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://ghoapi.azureedge.net/api/NCDMORT3070');
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch WHO data' }); }
};

exports.getAQI = async (req, res) => {
  const cacheKey = 'aqi_hyderabad';
  const cached = await getCache(cacheKey, 1800);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.385&longitude=78.4867&current=pm2_5,pm10');
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch AQI data' }); }
};

exports.getRandomUser = async (req, res) => {
  const cacheKey = 'randomuser';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://randomuser.me/api/?results=10&nat=in,us');
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch User data' }); }
};

  exports.getReddit = async (req, res) => {
    const cacheKey = 'reddit';
    const cached = await getCache(cacheKey, 900);
    if (cached) return res.json(cached);
    try {
      const response = await axios.get('https://www.reddit.com/r/Entrepreneur/top.json?limit=10&t=day', {
        headers: { 'User-Agent': 'web:operations-dashboard:v1.0 (by /u/elevatebox_dev)' }
      });
      await setCache(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      const mockRedditData = {
        data: { children: [
          { data: { title: "Reddit API blocked (Mock Data)", ups: 150, num_comments: 45 } },
          { data: { title: "How to handle API rate limits", ups: 89, num_comments: 12 } }
        ]}
      };
      await setCache(cacheKey, mockRedditData);
      res.json(mockRedditData);
    }
  };

  // ==========================================
  // B3 - NEWSAPI (IDHI ADD CHEYYALI)
  // ==========================================
  exports.getNews = async (req, res) => {
    const cacheKey = 'news_headlines';
    const cached = await getCache(cacheKey, 900);
    if (cached) return res.json(cached);
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=in&category=business&pageSize=20', {
        headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
      });
      await setCache(cacheKey, response.data);
      res.json(response.data);
    } catch (error) { 
      res.status(500).json({ error: 'Failed to fetch News data' }); 
    }
  };