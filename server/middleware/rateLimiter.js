const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { success: false, message: 'Too many attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

const respondLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  keyGenerator: (req) => {
    return req.ip + '_' + (req.params.shareToken || '');
  },
  message: { success: false, message: 'Too many submissions from this IP' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  authLimiter,
  respondLimiter
};
