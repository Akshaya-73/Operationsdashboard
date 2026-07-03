const { fetchWithRetry } = require('../utils/fetchWithRetry');

const CACHE_TTL = 15 * 60; // 15 minutes

exports.getHeadlines = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cached = cache.get('news:headlines', CACHE_TTL);
    
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const response = await fetchWithRetry(
      'https://newsapi.org/v2/top-headlines?country=in&category=business&pageSize=20',
      {
        headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
      }
    );

    const data = {
      articles: response.articles.map(article => ({
        title: article.title,
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        negativeTone: /crash|fall|drop|decline|loss|fail|crisis|scam|fraud/i.test(
          (article.title || '') + (article.description || '')
        )
      })),
      totalResults: response.totalResults,
      lastUpdated: new Date().toISOString()
    };

    cache.set('news:headlines', data);
    res.json(data);

  } catch (error) {
    console.error('NewsAPI Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.getMentionsByDay = async (req, res) => {
  try {
    const cache = req.app.get('cache');
    const cached = cache.get('news:mentions', CACHE_TTL);
    
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fromDate = sevenDaysAgo.toISOString().split('T')[0];

    const response = await fetchWithRetry(
      `https://newsapi.org/v2/everything?q=business&from=${fromDate}&sortBy=publishedAt&pageSize=100`,
      {
        headers: { 'X-Api-Key': process.env.NEWSAPI_KEY }
      }
    );

    const mentionsByDay = {};
    response.articles.forEach(article => {
      const day = article.publishedAt.split('T')[0];
      mentionsByDay[day] = (mentionsByDay[day] || 0) + 1;
    });

    const data = {
      mentionsByDay,
      totalMentions: response.totalResults,
      avgPerDay: Math.round(response.totalResults / 7),
      lastUpdated: new Date().toISOString()
    };

    cache.set('news:mentions', data);
    res.json(data);

  } catch (error) {
    console.error('News Mentions Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch mentions' });
  }
};