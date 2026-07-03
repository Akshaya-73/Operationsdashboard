const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');

// Level 2 Key-based Routes
router.get('/alphavantage', financeController.getAlphaVantage);
router.get('/openweather', financeController.getOpenWeather);
router.get('/news', financeController.getNews);
router.get('/fred', financeController.getFRED);
router.get('/usajobs', financeController.getUSAJobs);
router.get('/clockify', financeController.getClockify);
router.get('/notion', financeController.getNotion);
router.get('/airtable', financeController.getAirtable);
router.get('/trello', financeController.getTrello);
router.get('/aqicn', financeController.getAQICN);

module.exports = router;