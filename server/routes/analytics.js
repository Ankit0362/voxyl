const express = require('express');
const { getPollAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const pollOwner = require('../middleware/pollOwner');

const router = express.Router();

router.get('/:pollId/summary', protect, pollOwner, getPollAnalytics);

module.exports = router;