const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    country: {
      type: String,
      required: true
    }
  },
  interests: [{
    type: String,
    enum: ['conservation', 'reforestation', 'wildlife', 'marine', 'education', 'community', 'research', 'fundraising', 'events']
  }],
  skills: [String],
  availability: {
    weekdays: {
      type: Boolean,
      default: false
    },
    weekends: {
      type: Boolean,
      default: false
    },
    evenings: {
      type: Boolean,
      default: false
    },
    flexible: {
      type: Boolean,
      default: false
    }
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced'],
    default: 'beginner'
  },
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
    default: 'pending'
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: String,
  confirmationExpires: Date,
  notes: String,
  assignedProjects: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    role: String,
    startDate: Date,
    endDate: Date
  }]
}, {
  timestamps: true
});

// Virtual for full name
volunteerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
volunteerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Volunteer', volunteerSchema);
