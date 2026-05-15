const Poll = require('../models/Poll');
const Response = require('../models/Response');
const { checkDuplicateResponse, aggregateResults } = require('../utils/pollUtils');

const getPollByToken = async (req, res, next) => {
  try {
    const poll = await Poll.findOne({ shareToken: req.params.shareToken });
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (poll.isPublished) {
      const analyticsData = await aggregateResults(poll._id);
      return res.status(200).json({
        success: true,
        status: 'published',
        poll: {
          title: poll.title,
          description: poll.description,
          questions: poll.questions,
          expiresAt: poll.expiresAt,
          publishedAt: poll.publishedAt
        },
        results: analyticsData
      });
    }

    if (poll.isExpired) {
      return res.status(200).json({
        success: true,
        status: 'expired',
        poll: { title: poll.title, expiresAt: poll.expiresAt }
      });
    }

    if (poll.requiresAuth && !req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required', requiresAuth: true });
    }

    return res.status(200).json({
      success: true,
      status: 'active',
      poll: {
        _id: poll._id,
        title: poll.title,
        description: poll.description,
        questions: poll.questions,
        expiresAt: poll.expiresAt,
        isAnonymous: poll.isAnonymous,
        requiresAuth: poll.requiresAuth
      }
    });
  } catch (error) {
    next(error);
  }
};

const submitResponse = async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers must be an array' });
    }

    const poll = await Poll.findOne({ shareToken: req.params.shareToken });
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(410).json({ success: false, message: 'Poll is no longer active' });
    }

    if (poll.requiresAuth && !req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const isDuplicate = req.user 
      ? await checkDuplicateResponse(poll._id, req.user._id, null)
      : await checkDuplicateResponse(poll._id, null, req.ip);

    if (isDuplicate) {
      return res.status(409).json({ success: false, message: 'You have already responded to this poll' });
    }

    const requiredQuestions = poll.questions.filter(q => q.isRequired);
    const missingQuestions = [];

    for (const q of requiredQuestions) {
      const hasAnswer = answers.some(a => a.questionId.toString() === q._id.toString());
      if (!hasAnswer) {
        missingQuestions.push({ questionId: q._id, questionText: q.text });
      }
    }

    if (missingQuestions.length > 0) {
      return res.status(422).json({
        success: false,
        message: 'Please answer all required questions',
        missingQuestions
      });
    }

    for (const answer of answers) {
      const question = poll.questions.find(q => q._id.toString() === answer.questionId.toString());
      if (!question) {
        return res.status(400).json({ success: false, message: 'Invalid question ID' });
      }
      const option = question.options.find(o => o._id.toString() === answer.selectedOptionId.toString());
      if (!option) {
        return res.status(400).json({ success: false, message: 'Invalid option ID' });
      }
    }

    const response = new Response({
      pollId: poll._id,
      answers,
      respondentId: req.user ? req.user._id : null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await response.save();
    const updatedPoll = await Poll.findByIdAndUpdate(poll._id, { $inc: { totalResponses: 1 } }, { new: true });

    const io = req.app.get('io');
    if (io) {
      io.to(`poll_${poll._id}`).emit('response_update', {
        pollId: poll._id,
        totalResponses: updatedPoll.totalResponses,
        lastAnswer: answers
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Response submitted successfully',
      isPublished: poll.isPublished
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPollByToken, submitResponse };
