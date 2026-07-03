const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/headlines', newsController.getHeadlines);
router.get('/mentions', newsController.getMentionsByDay);

module.exports = router;