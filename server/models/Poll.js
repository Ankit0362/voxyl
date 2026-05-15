const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }
});

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  options: {
    type: [OptionSchema],
    validate: {
      validator: function(arr) {
        return arr && arr.length >= 2;
      },
      message: 'Min 2 options'
    }
  }
});

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: {
    type: [QuestionSchema],
    validate: {
      validator: function(arr) {
        return arr && arr.length >= 1;
      },
      message: 'Min 1 question required'
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  requiresAuth: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiry must be in the future'
    }
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  shareToken: {
    type: String,
    unique: true
  },
  totalResponses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

pollSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

pollSchema.virtual('isActive').get(function() {
  return !this.isExpired && !this.isPublished;
});

pollSchema.index({ shareToken: 1 }, { unique: true });
pollSchema.index({ createdBy: 1 });
pollSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Poll', pollSchema);
