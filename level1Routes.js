const express = require('express');
const router = express.Router();
const level1Controller = require('../controllers/level1Controller');

router.get('/coingecko', level1Controller.getCoinGecko);
router.get('/coingecko/sparkline', level1Controller.getCoinGeckoSparkline);
router.get('/frankfurter', level1Controller.getFrankfurter);
router.get('/worldbank', level1Controller.getWorldBank);
router.get('/hackernews', level1Controller.getHackerNews);
router.get('/who', level1Controller.getWHO);
router.get('/aqi', level1Controller.getAQI);
router.get('/randomuser', level1Controller.getRandomUser);
router.get('/reddit', level1Controller.getReddit);
router.get('/news', level1Controller.getNews); // NEW LINE

module.exports = router;