const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register',
  authLimiter,
  [
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 chars').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be alphanumeric with underscores'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  handleValidationErrors,
  register
);

router.post('/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

router.get('/me', protect, getMe);

module.exports = router;