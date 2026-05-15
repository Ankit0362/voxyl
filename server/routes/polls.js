const express = require('express');
const { body } = require('express-validator');
const { createPoll, getMyPolls, getPollById, updatePoll, deletePoll, publishPoll } = require('../controllers/pollController');
const { protect } = require('../middleware/auth');
const pollOwner = require('../middleware/pollOwner');
const { handleValidationErrors } = require('../middleware/validateRequest');

const router = express.Router();

router.post('/create',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 chars'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
    body('expiresAt').notEmpty().withMessage('Expiry date is required'),
    body('questions').isArray({ min: 1 }).withMessage('Min 1 question required')
  ],
  handleValidationErrors,
  createPoll
);

router.get('/my-polls', protect, getMyPolls);

router.get('/:pollId', protect, pollOwner, getPollById);

router.put('/:pollId',
  protect,
  pollOwner,
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 chars'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
    body('expiresAt').notEmpty().withMessage('Expiry date is required'),
    body('questions').isArray({ min: 1 }).withMessage('Min 1 question required')
  ],
  handleValidationErrors,
  updatePoll
);

router.delete('/:pollId', protect, pollOwner, deletePoll);

router.post('/:pollId/publish', protect, pollOwner, publishPoll);

module.exports = router;