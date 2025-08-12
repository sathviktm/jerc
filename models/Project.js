const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['conservation', 'reforestation', 'wildlife', 'marine', 'education', 'community', 'research']
  },
  status: {
    type: String,
    required: true,
    enum: ['ongoing', 'completed', 'planned'],
    default: 'ongoing'
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  impact: {
    treesPlanted: Number,
    animalsSaved: Number,
    areaCovered: Number,
    volunteersInvolved: Number,
    description: String
  },
  budget: {
    target: Number,
    raised: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
projectSchema.index({ title: 'text', description: 'text', category: 1, status: 1 });

module.exports = mongoose.model('Project', projectSchema);
