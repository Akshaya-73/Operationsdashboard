const Cache = require('../models/Cache');

const getCache = async (key, ttlSeconds) => {
  try {
    const cached = await Cache.findOne({ key });
    if (cached) {
      const age = (Date.now() - new Date(cached.timestamp).getTime()) / 1000;
      if (age < ttlSeconds) {
        console.log(`✅ Mongo Cache HIT: ${key}`);
        return cached.data;
      }
      console.log(`⏳ Mongo Cache EXPIRED: ${key}`);
    }
    return null;
  } catch (error) {
    console.error("⚠️ Cache READ error:", error.message);
    return null; // Error vacchina kuda, API ki veli fetch cheyali
  }
};

const setCache = async (key, data) => {
  try {
    await Cache.findOneAndUpdate(
      { key },
      { key, data, timestamp: new Date() },
      { upsert: true, new: true } // Idi data update cheyadam kada, lekapothe create cheyadam
    );
    console.log(`💾 Saved to Mongo Cache: ${key}`);
  } catch (error) {
    console.error("⚠️ Cache WRITE error:", error.message);
  }
};

module.exports = { getCache, setCache };