const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  selectedOptionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const responseSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  isComplete: {
    type: Boolean,
    default: true
  },
  answers: [AnswerSchema]
});

responseSchema.index({ pollId: 1 });
responseSchema.index({ respondentId: 1, pollId: 1 });
responseSchema.index({ ipAddress: 1, pollId: 1 });

responseSchema.pre('save', function(next) {
  if (!this.submittedAt) {
    this.submittedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('Response', responseSchema);
