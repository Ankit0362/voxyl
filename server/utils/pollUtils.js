const mongoose = require('mongoose');
const Response = require('../models/Response');

async function checkDuplicateResponse(pollId, userId, ipAddress) {
  if (userId) {
    const existing = await Response.findOne({ pollId, respondentId: userId }).lean();
    return !!existing;
  }
  if (ipAddress) {
    const existing = await Response.findOne({ pollId, ipAddress }).lean();
    return !!existing;
  }
  return false;
}

function calculatePollStatus(poll) {
  if (poll.isPublished) return 'published';
  if (poll.expiresAt && poll.expiresAt <= new Date()) return 'expired';
  return 'active';
}

async function aggregateResults(pollId) {
  const result = await Response.aggregate([
    { $match: { pollId: new mongoose.Types.ObjectId(pollId) } },
    { $unwind: '$answers' },
    { 
      $group: { 
        _id: { 
          questionId: '$answers.questionId', 
          optionId: '$answers.selectedOptionId' 
        }, 
        count: { $sum: 1 } 
      } 
    }
  ]);

  const structuredResult = {};
  for (const item of result) {
    const questionId = item._id.questionId.toString();
    const optionId = item._id.optionId.toString();

    if (!structuredResult[questionId]) {
      structuredResult[questionId] = {};
    }
    structuredResult[questionId][optionId] = item.count;
  }

  return structuredResult;
}

module.exports = {
  checkDuplicateResponse,
  calculatePollStatus,
  aggregateResults
};
