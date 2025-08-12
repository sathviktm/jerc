const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['workshop', 'cleanup', 'fundraiser', 'awareness', 'volunteer', 'meeting', 'training']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  capacity: {
    type: Number,
    default: 0 // 0 means unlimited
  },
  registeredAttendees: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  images: [{
    url: String,
    caption: String
  }],
  requirements: [String],
  isFree: {
    type: Boolean,
    default: true
  },
  fee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  organizer: {
    name: String,
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ startDate: 1, status: 1, type: 1 });

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function() {
  if (this.capacity === 0) return false;
  return this.registeredAttendees.length >= this.capacity;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (this.capacity === 0) return 'Unlimited';
  return Math.max(0, this.capacity - this.registeredAttendees.length);
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
