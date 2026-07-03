const axios = require('axios');

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        headers: options.headers || {},
        data: options.body || undefined,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      const status = error.response?.status;

      // 4xx (except 429) = don't retry
      if (status >= 400 && status < 500 && status !== 429) {
        throw error;
      }

      // 429 or 5xx = retry
      if (attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
        console.log(`⏳ Retry ${attempt}/${maxRetries} for ${url} - Waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      throw error;
    }
  }
}

module.exports = { fetchWithRetry };