const fetchWithRetry = require('../utils/fetchWithRetry');
const { getCache, setCache } = require('../utils/cache');
require('dotenv').config();

// B1: Alpha Vantage
exports.getAlphaVantage = async (req, res) => {
  const cacheKey = 'alphavantage_reliance';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RELIANCE.BSE&apikey=${process.env.ALPHAVANTAGE_KEY}`;
    const data = await fetchWithRetry(url);
    
    // If API returns empty data (Invalid Key or Limit reached)
    if (!data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      throw new Error("Invalid API Key or Rate Limit");
    }
    
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.log("⚠️ Alpha Vantage failed. Serving Mock Data.");
    const mockStock = {
      "Global Quote": {
        "05. price": "2895.50",
        "10. change percent": "-1.25%"
      },
      isMock: true
    };
    await setCache(cacheKey, mockStock);
    res.json(mockStock);
  }
};

// B2: OpenWeatherMap
exports.getOpenWeather = async (req, res) => {
  const cacheKey = 'openweather_hyderabad';
  const cached = await getCache(cacheKey, 1800);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=17.385&lon=78.4867&appid=${process.env.OPENWEATHER_KEY}&units=metric`;
    const data = await fetchWithRetry(url);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.log("⚠️ OpenWeather failed. Serving Mock Data.");
    const mockWeather = {
      main: { temp: 33.5 },
      weather: [{ description: "haze" }],
      isMock: true
    };
    await setCache(cacheKey, mockWeather);
    res.json(mockWeather);
  }
};

// B3: NewsAPI
exports.getNews = async (req, res) => {
  const cacheKey = 'newsapi_business';
  const cached = await getCache(cacheKey, 43200);
  if (cached) return res.json(cached);
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${process.env.NEWSAPI_KEY}`;
    const data = await fetchWithRetry(url, { headers: { 'X-Api-Key': process.env.NEWSAPI_KEY } });
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    console.log("⚠️ NewsAPI failed. Serving Mock Data.");
    const mockNews = {
      totalResults: 2,
      articles: [
        { title: "Markets rally as tech stocks surge (Mock)", description: "Business news update" },
        { title: "RBI holds interest rates steady (Mock)", description: "Economy updates" }
      ],
      isMock: true
    };
    await setCache(cacheKey, mockNews);
    res.json(mockNews);
  }
};

// B4: FRED
exports.getFRED = async (req, res) => {
  const cacheKey = 'fred_cpi';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${process.env.FRED_KEY}&file_type=json`;
    const data = await fetchWithRetry(url);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    const mockFred = { observations: [{ date: "2024-01-01", value: "302.5" }], isMock: true };
    await setCache(cacheKey, mockFred);
    res.json(mockFred);
  }
};

// B5: USAJOBS
exports.getUSAJobs = async (req, res) => {
  const cacheKey = 'usajobs';
  const cached = await getCache(cacheKey, 86400);
  if (cached) return res.json(cached);
  try {
    const url = `https://data.usajobs.gov/api/Search?Keyword=compliance&LocationName=Washington,DC`;
    const options = { headers: { 'Authorization-Key': process.env.USAJOBS_KEY, 'User-Agent': process.env.USAJOBS_EMAIL } };
    const data = await fetchWithRetry(url, options);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    const mockJobs = { SearchResult: { SearchResultItems: [{ MatchedObjectDescriptor: { PositionTitle: "Compliance Officer (Mock)" } }] }, isMock: true };
    await setCache(cacheKey, mockJobs);
    res.json(mockJobs);
  }
};

// B6: Clockify
exports.getClockify = async (req, res) => {
  const cacheKey = 'clockify_time';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const workspaceId = "YOUR_WORKSPACE_ID"; 
    const url = `https://api.clockify.me/api/v1/workspaces/${workspaceId}/time-entries`;
    const options = { headers: { 'X-Api-Key': process.env.CLOCKIFY_KEY } };
    const data = await fetchWithRetry(url, options);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
const mockClockify = [{ description: "SOP Review (Mock)", timeInterval: { duration: "PT2H30M" }, isMock: true }];    await setCache(cacheKey, mockClockify);
    res.json(mockClockify);
  }
};

// B7: Notion
exports.getNotion = async (req, res) => {
  const cacheKey = 'notion_sops';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const axios = require('axios');
    const response = await axios.post(`https://api.notion.com/v1/databases/YOUR_DATABASE_ID/query`, {}, {
      headers: { 'Authorization': `Bearer ${process.env.NOTION_KEY}`, 'Notion-Version': '2022-06-28' }
    });
    await setCache(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    const mockNotion = { results: [{ properties: { Name: { title: [{ plain_text: "Treasury SOP (Mock)" }] }, Status: { status: { name: "Published" } } } }], isMock: true };
    await setCache(cacheKey, mockNotion);
    res.json(mockNotion);
  }
};

// B8: Airtable
exports.getAirtable = async (req, res) => {
  const cacheKey = 'airtable_clients';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME`;
    const options = { headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_KEY}` } };
    const data = await fetchWithRetry(url, options);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    const mockAirtable = { records: [{ fields: { ClientName: "Acme Corp (Mock)", Status: "Active" } }], isMock: true };
    await setCache(cacheKey, mockAirtable);
    res.json(mockAirtable);
  }
};

// B9: Trello
exports.getTrello = async (req, res) => {
  const cacheKey = 'trello_boards';
  const cached = await getCache(cacheKey, 3600);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.trello.com/1/members/me/boards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;
    const data = await fetchWithRetry(url);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
const mockTrello = [{ name: "Operations Board (Mock)", prefs: { backgroundColor: "#0079bf" }, isMock: true }];    await setCache(cacheKey, mockTrello);
    res.json(mockTrello);
  }
};

// B10: AQICN
exports.getAQICN = async (req, res) => {
  const cacheKey = 'aqicn_hyderabad';
  const cached = await getCache(cacheKey, 1800);
  if (cached) return res.json(cached);
  try {
    const url = `https://api.waqi.info/feed/hyderabad/?token=${process.env.AQICN_TOKEN}`;
    const data = await fetchWithRetry(url);
    await setCache(cacheKey, data);
    res.json(data);
  } catch (error) {
    const mockAqicn = { data: { aqi: 115, city: { name: "Hyderabad (Mock)" } }, isMock: true };
    await setCache(cacheKey, mockAqicn);
    res.json(mockAqicn);
  }
};