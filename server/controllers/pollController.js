const Poll = require('../models/Poll');
const Response = require('../models/Response');
const { nanoid } = require('nanoid');

const createPoll = async (req, res, next) => {
  try {
    const { title, description, expiresAt, isAnonymous, requiresAuth, questions } = req.body;

    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate) || expiryDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Expiry must be in the future' });
    }

    if (!questions || !Array.isArray(questions) || questions.length < 1) {
      return res.status(400).json({ success: false, message: 'Min 1 question required' });
    }

    for (const q of questions) {
      if (!q.text || q.text.trim() === '') {
        return res.status(400).json({ success: false, message: 'Question text is required' });
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ success: false, message: 'Each question requires min 2 options' });
      }
      for (const o of q.options) {
        if (!o.text || o.text.trim() === '') {
          return res.status(400).json({ success: false, message: 'Option text is required' });
        }
      }
    }

    const shareToken = nanoid(10);
    const mappedQuestions = questions.map((q, index) => ({
      text: q.text,
      isRequired: q.isRequired || false,
      order: index,
      options: q.options.map(o => ({ text: o.text }))
    }));

    const poll = await new Poll({
      title,
      description: description || '',
      createdBy: req.user._id,
      isAnonymous: !!isAnonymous,
      requiresAuth: !!requiresAuth,
      expiresAt: expiryDate,
      questions: mappedQuestions,
      shareToken
    }).save();

    return res.status(201).json({
      success: true,
      poll: { ...poll.toJSON(), shareToken },
      message: 'Poll created'
    });
  } catch (error) {
    next(error);
  }
};

const getMyPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id })
      .select('title description expiresAt isPublished shareToken totalResponses createdAt')
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return res.status(200).json({ success: true, count: polls.length, polls });
  } catch (error) {
    next(error);
  }
};

const getPollById = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, poll: req.poll });
  } catch (error) {
    next(error);
  }
};

const updatePoll = async (req, res, next) => {
  try {
    if (req.poll.totalResponses > 0) {
      return res.status(400).json({ success: false, message: 'Cannot edit poll with responses' });
    }
    if (req.poll.isPublished) {
      return res.status(400).json({ success: false, message: 'Cannot edit published poll' });
    }

    const { title, description, expiresAt, isAnonymous, requiresAuth, questions } = req.body;

    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate) || expiryDate <= new Date()) {
      return res.status(400).json({ success: false, message: 'Expiry must be in the future' });
    }

    if (!questions || !Array.isArray(questions) || questions.length < 1) {
      return res.status(400).json({ success: false, message: 'Min 1 question required' });
    }

    for (const q of questions) {
      if (!q.text || q.text.trim() === '') {
        return res.status(400).json({ success: false, message: 'Question text is required' });
      }
      if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
        return res.status(400).json({ success: false, message: 'Each question requires min 2 options' });
      }
      for (const o of q.options) {
        if (!o.text || o.text.trim() === '') {
          return res.status(400).json({ success: false, message: 'Option text is required' });
        }
      }
    }

    const mappedQuestions = questions.map((q, index) => ({
      text: q.text,
      isRequired: q.isRequired || false,
      order: index,
      options: q.options.map(o => ({ text: o.text }))
    }));

    const updatedPoll = await Poll.findByIdAndUpdate(
      req.params.pollId,
      {
        title,
        description: description || '',
        expiresAt: expiryDate,
        isAnonymous: !!isAnonymous,
        requiresAuth: !!requiresAuth,
        questions: mappedQuestions
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, poll: updatedPoll, message: 'Poll updated' });
  } catch (error) {
    next(error);
  }
};

const deletePoll = async (req, res, next) => {
  try {
    await Response.deleteMany({ pollId: req.params.pollId });
    await Poll.findByIdAndDelete(req.params.pollId);
    return res.status(200).json({ success: true, message: 'Poll deleted' });
  } catch (error) {
    next(error);
  }
};

const publishPoll = async (req, res, next) => {
  try {
    if (req.poll.isPublished) {
      return res.status(400).json({ success: false, message: 'Poll already published' });
    }
    if (req.poll.totalResponses === 0) {
      return res.status(400).json({ success: false, message: 'Cannot publish poll with no responses' });
    }

    const updatedPoll = await Poll.findByIdAndUpdate(
      req.params.pollId,
      { isPublished: true, publishedAt: new Date() },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`poll_${req.params.pollId}`).emit('poll_published', { pollId: req.params.pollId });
    }

    return res.status(200).json({ success: true, message: 'Results published successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPoll, getMyPolls, getPollById, updatePoll, deletePoll, publishPoll
};
