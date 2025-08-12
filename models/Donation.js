const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
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
      lowercase: true,
      trim: true
    },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    required: true
  },
  transactionId: String,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextPaymentDate: Date,
    endDate: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: String,
  receiptSent: {
    type: Boolean,
    default: false
  },
  receiptEmail: String,
  taxReceipt: {
    issued: {
      type: Boolean,
      default: false
    },
    number: String,
    issuedAt: Date
  },
  metadata: {
    source: String, // website, mobile, campaign, etc.
    campaign: String,
    referrer: String,
    userAgent: String
  }
}, {
  timestamps: true
});

// Index for better query performance
donationSchema.index({ 'donor.email': 1, paymentStatus: 1, createdAt: -1 });
donationSchema.index({ project: 1, paymentStatus: 1 });

// Virtual for full donor name
donationSchema.virtual('donor.fullName').get(function() {
  return `${this.donor.firstName} ${this.donor.lastName}`;
});

// Ensure virtual fields are serialized
donationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Donation', donationSchema);
