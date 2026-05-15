const Poll = require('../models/Poll');

const pollOwner = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId).lean();

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: you do not own this poll' });
    }

    req.poll = poll;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = pollOwner;
