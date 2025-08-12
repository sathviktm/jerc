const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Volunteer = require('../models/Volunteer');
const { auth, moderatorAuth } = require('../middleware/auth');

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/volunteers/signup
// @desc    Volunteer signup
// @access  Public
router.post('/signup', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName, lastName, email, phone, dateOfBirth, address,
      interests, skills, availability, experience, emergencyContact
    } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer with this email already exists' });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const confirmationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create volunteer
    const volunteer = new Volunteer({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      interests: interests || [],
      skills: skills || [],
      availability: availability || {},
      experience: experience || 'beginner',
      emergencyContact,
      confirmationToken,
      confirmationExpires
    });

    await volunteer.save();

    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email?token=${confirmationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Our Environmental NGO - Confirm Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Welcome to Our Environmental NGO!</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for signing up to volunteer with us! We're excited to have you join our mission to protect the environment.</p>
          <p>To complete your registration, please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Email Address
            </a>
          </div>
          <p>This link will expire in 24 hours. If you didn't sign up for this account, please ignore this email.</p>
          <p>Best regards,<br>The Environmental NGO Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Volunteer registration successful. Please check your email to confirm your account.',
      volunteerId: volunteer._id
    });
  } catch (error) {
    console.error('Volunteer signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/volunteers/confirm-email
// @desc    Confirm volunteer email
// @access  Public
router.post('/confirm-email', [
  body('token').notEmpty().withMessage('Confirmation token is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;

    const volunteer = await Volunteer.findOne({
      confirmationToken: token,
      confirmationExpires: { $gt: Date.now() }
    });

    if (!volunteer) {
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    volunteer.emailConfirmed = true;
    volunteer.confirmationToken = undefined;
    volunteer.confirmationExpires = undefined;
    await volunteer.save();

    // Send welcome email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: volunteer.email,
      subject: 'Email Confirmed - Welcome to Our Environmental NGO!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Email Confirmed!</h2>
          <p>Dear ${volunteer.firstName} ${volunteer.lastName},</p>
          <p>Your email has been successfully confirmed! You're now officially part of our volunteer community.</p>
          <p>Our team will review your application and get back to you within 2-3 business days with next steps.</p>
          <p>In the meantime, you can:</p>
          <ul>
            <li>Browse our upcoming events</li>
            <li>Learn more about our current projects</li>
            <li>Follow us on social media for updates</li>
          </ul>
          <p>Thank you for joining our mission to protect the environment!</p>
          <p>Best regards,<br>The Environmental NGO Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Email confirmed successfully! Welcome to our volunteer community.'
    });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers
// @desc    Get all volunteers (admin/moderator only)
// @access  Private
router.get('/', moderatorAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, experience, interests } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (experience) query.experience = experience;
    if (interests) query.interests = { $in: interests.split(',') };

    const volunteers = await Volunteer.find(query)
      .populate('assignedProjects.project', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Volunteer.countDocuments(query);

    res.json({
      volunteers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/:id
// @desc    Get volunteer by ID
// @access  Private
router.get('/:id', moderatorAuth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate('assignedProjects.project', 'title description');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    console.error('Get volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/volunteers/:id/status
// @desc    Update volunteer status
// @access  Private
router.put('/:id/status', moderatorAuth, [
  body('status').isIn(['pending', 'approved', 'rejected', 'active', 'inactive']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.status = status;
    if (notes) volunteer.notes = notes;
    await volunteer.save();

    // Send status update email
    const statusMessages = {
      approved: 'Your volunteer application has been approved! Welcome to our team.',
      rejected: 'We regret to inform you that your volunteer application has not been approved at this time.',
      active: 'Your volunteer status has been activated. You can now participate in our events and projects.',
      inactive: 'Your volunteer status has been set to inactive. Please contact us if you have any questions.'
    };

    if (statusMessages[status]) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: volunteer.email,
        subject: `Volunteer Application Update - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2e7d32;">Volunteer Application Update</h2>
            <p>Dear ${volunteer.firstName} ${volunteer.lastName},</p>
            <p>${statusMessages[status]}</p>
            ${notes ? `<p><strong>Additional Notes:</strong> ${notes}</p>` : ''}
            <p>Thank you for your interest in our organization.</p>
            <p>Best regards,<br>The Environmental NGO Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({
      success: true,
      message: 'Volunteer status updated successfully',
      volunteer
    });
  } catch (error) {
    console.error('Update volunteer status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/volunteers/stats
// @desc    Get volunteer statistics
// @access  Private
router.get('/stats/overview', moderatorAuth, async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();
    const confirmedVolunteers = await Volunteer.countDocuments({ emailConfirmed: true });
    const activeVolunteers = await Volunteer.countDocuments({ status: 'active' });
    const pendingVolunteers = await Volunteer.countDocuments({ status: 'pending' });

    const experienceStats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$experience',
          count: { $sum: 1 }
        }
      }
    ]);

    const interestStats = await Volunteer.aggregate([
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalVolunteers,
      confirmedVolunteers,
      activeVolunteers,
      pendingVolunteers,
      experienceStats,
      interestStats
    });
  } catch (error) {
    console.error('Get volunteer stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
