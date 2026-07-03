const express = require('express');
const router = express.Router();
const level2Controller = require('../controllers/level2Controller');

// B3 - NewsAPI
router.get('/news', level2Controller.getNews);

// B4 - FRED
router.get('/fred', level2Controller.getFRED);

// B5 - USAJOBS
router.get('/usajobs', level2Controller.getUSAJobs);

// B6 - Clockify
router.get('/clockify', level2Controller.getClockify);

// B7 - Notion
router.get('/notion', level2Controller.getNotion);

// B8 - Airtable
router.get('/airtable', level2Controller.getAirtable);

// B9 - Trello
router.get('/trello', level2Controller.getTrello);

// B10 - AQICN
router.get('/aqicn', level2Controller.getAQICN);

module.exports = router;