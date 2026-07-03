const mongoose = require('mongoose');

const cacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: mongoose.Schema.Types.Mixed, // Any JSON data store cheyochu
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cache', cacheSchema);