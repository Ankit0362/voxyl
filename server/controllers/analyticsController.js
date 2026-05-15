const mongoose = require('mongoose');
const Response = require('../models/Response');
const { calculatePollStatus } = require('../utils/pollUtils');

const getPollAnalytics = async (req, res, next) => {
  try {
    const poll = req.poll;
    const pollId = poll._id;

    if (poll.totalResponses === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalResponses: 0,
          completionRate: 0,
          questions: poll.questions.map(q => ({
            questionId: q._id,
            questionText: q.text,
            isRequired: q.isRequired,
            totalAnswered: 0,
            skipped: 0,
            options: q.options.map(o => ({
              optionId: o._id,
              optionText: o.text,
              count: 0,
              percentage: 0
            }))
          })),
          participationByDate: [],
          pollStatus: calculatePollStatus(poll),
          poll: {
            title: poll.title,
            description: poll.description,
            expiresAt: poll.expiresAt,
            isPublished: poll.isPublished,
            totalResponses: poll.totalResponses,
            shareToken: poll.shareToken,
            createdAt: poll.createdAt
          }
        }
      });
    }

    const responsesByDate = await Response.aggregate([
      { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
      { $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const optionCounts = await Response.aggregate([
      { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
      { $unwind: '$answers' },
      { $group: {
          _id: { 
            questionId: '$answers.questionId', 
            optionId: '$answers.selectedOptionId' 
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const fullyCompletedCount = await Response.countDocuments({
      pollId: new mongoose.Types.ObjectId(pollId),
      answers: { $size: poll.questions.length }
    });

    const completionRate = Math.round((fullyCompletedCount / poll.totalResponses) * 100);

    const questionsAnalytics = poll.questions.map(q => {
      const qCounts = optionCounts.filter(c => c._id.questionId.toString() === q._id.toString());
      const totalAnswered = qCounts.reduce((sum, c) => sum + c.count, 0);

      return {
        questionId: q._id,
        questionText: q.text,
        isRequired: q.isRequired,
        totalAnswered,
        skipped: poll.totalResponses - totalAnswered,
        options: q.options.map(o => {
          const found = qCounts.find(c => c._id.optionId.toString() === o._id.toString());
          const count = found ? found.count : 0;
          return {
            optionId: o._id,
            optionText: o.text,
            count,
            percentage: totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0
          };
        })
      };
    });

    const participationByDate = responsesByDate.map(r => ({ date: r._id, count: r.count }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalResponses: poll.totalResponses,
        completionRate,
        questions: questionsAnalytics,
        participationByDate,
        pollStatus: calculatePollStatus(poll),
        poll: {
          title: poll.title,
          description: poll.description,
          expiresAt: poll.expiresAt,
          isPublished: poll.isPublished,
          totalResponses: poll.totalResponses,
          shareToken: poll.shareToken,
          createdAt: poll.createdAt
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { getPollAnalytics };
