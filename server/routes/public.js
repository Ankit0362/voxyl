const express = require('express');
const { getPollByToken, submitResponse } = require('../controllers/publicController');
const { optionalAuth } = require('../middleware/auth');
const { respondLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/poll/:shareToken', optionalAuth, getPollByToken);

router.post('/poll/:shareToken/respond', optionalAuth, respondLimiter, submitResponse);

module.exports = router;