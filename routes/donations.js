const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const Donation = require('../models/Donation');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/donations/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Public
router.post('/create-payment-intent', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  body('donor.firstName').notEmpty().withMessage('First name is required'),
  body('donor.lastName').notEmpty().withMessage('Last name is required'),
  body('donor.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, donor, projectId, isRecurring, recurringDetails } = req.body;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        donorEmail: donor.email,
        projectId: projectId || '',
        isRecurring: isRecurring ? 'true' : 'false'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// @route   POST /api/donations/create-razorpay-order
// @desc    Create Razorpay order
// @access  Public
router.post('/create-razorpay-order', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['INR']).withMessage('Only INR currency supported'),
  body('donor.firstName').notEmpty().withMessage('First name is required'),
  body('donor.lastName').notEmpty().withMessage('Last name is required'),
  body('donor.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, donor, projectId } = req.body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: `donation_${Date.now()}`,
      notes: {
        donorEmail: donor.email,
        projectId: projectId || ''
      }
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// @route   POST /api/donations/confirm-stripe
// @desc    Confirm Stripe payment and save donation
// @access  Public
router.post('/confirm-stripe', [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('donor').isObject().withMessage('Donor information is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, donor, amount, currency, projectId, isRecurring, recurringDetails, message, isAnonymous } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Create donation record
    const donation = new Donation({
      donor,
      amount,
      currency,
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      paymentId: paymentIntentId,
      transactionId: paymentIntent.charges.data[0]?.id,
      project: projectId,
      isRecurring,
      recurringDetails,
      message,
      isAnonymous,
      metadata: {
        source: 'website',
        userAgent: req.headers['user-agent']
      }
    });

    await donation.save();

    // Update project raised amount if project specified
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'budget.raised': amount }
      });
    }

    res.json({
      success: true,
      donationId: donation._id,
      message: 'Donation recorded successfully'
    });
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    res.status(500).json({ message: 'Error confirming donation' });
  }
});

// @route   POST /api/donations/confirm-razorpay
// @desc    Confirm Razorpay payment and save donation
// @access  Public
router.post('/confirm-razorpay', [
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
  body('donor').isObject().withMessage('Donor information is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, donor, amount, currency, projectId, message, isAnonymous } = req.body;

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = require('crypto')
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Create donation record
    const donation = new Donation({
      donor,
      amount: amount / 100, // Convert from paise to rupees
      currency,
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id,
      transactionId: razorpay_order_id,
      project: projectId,
      message,
      isAnonymous,
      metadata: {
        source: 'website',
        userAgent: req.headers['user-agent']
      }
    });

    await donation.save();

    // Update project raised amount if project specified
    if (projectId) {
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'budget.raised': amount / 100 }
      });
    }

    res.json({
      success: true,
      donationId: donation._id,
      message: 'Donation recorded successfully'
    });
  } catch (error) {
    console.error('Razorpay confirmation error:', error);
    res.status(500).json({ message: 'Error confirming donation' });
  }
});

// @route   GET /api/donations
// @desc    Get all donations (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, projectId } = req.query;
    
    const query = {};
    if (status) query.paymentStatus = status;
    if (projectId) query.project = projectId;

    const donations = await Donation.find(query)
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/stats
// @desc    Get donation statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    const totalAmount = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyStats = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      monthlyStats
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
