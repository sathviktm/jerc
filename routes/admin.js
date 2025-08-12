const express = require('express');
const { adminAuth } = require('../middleware/auth');
const Project = require('../models/Project');
const Volunteer = require('../models/Volunteer');
const Event = require('../models/Event');
const News = require('../models/News');
const Donation = require('../models/Donation');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get counts
    const totalProjects = await Project.countDocuments();
    const totalVolunteers = await Volunteer.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalNews = await News.countDocuments();
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });

    // Get recent activities
    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    const recentVolunteers = await Volunteer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email status createdAt');

    const recentDonations = await Donation.find({ paymentStatus: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('donor amount currency createdAt');

    // Get financial stats
    const totalRaised = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyDonations = await Donation.aggregate([
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
      { $limit: 6 }
    ]);

    // Get project stats
    const projectStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get volunteer stats
    const volunteerStats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      counts: {
        projects: totalProjects,
        volunteers: totalVolunteers,
        events: totalEvents,
        news: totalNews,
        donations: totalDonations
      },
      financial: {
        totalRaised: totalRaised[0]?.total || 0,
        monthlyDonations
      },
      recent: {
        projects: recentProjects,
        volunteers: recentVolunteers,
        donations: recentDonations
      },
      stats: {
        projects: projectStats,
        volunteers: volunteerStats
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/volunteers/pending
// @desc    Get pending volunteer applications
// @access  Private (Admin only)
router.get('/volunteers/pending', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const volunteers = await Volunteer.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Volunteer.countDocuments({ status: 'pending' });

    res.json({
      volunteers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get pending volunteers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/donations/recent
// @desc    Get recent donations
// @access  Private (Admin only)
router.get('/donations/recent', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const donations = await Donation.find({ paymentStatus: 'completed' })
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Donation.countDocuments({ paymentStatus: 'completed' });

    res.json({
      donations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get recent donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/events/upcoming
// @desc    Get upcoming events
// @access  Private (Admin only)
router.get('/events/upcoming', adminAuth, async (req, res) => {
  try {
    const events = await Event.find({
      startDate: { $gte: new Date() },
      status: 'published'
    })
    .sort({ startDate: 1 })
    .limit(10)
    .populate('registeredAttendees.volunteer', 'firstName lastName email');

    res.json(events);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/projects/active
// @desc    Get active projects
// @access  Private (Admin only)
router.get('/projects/active', adminAuth, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'ongoing' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title category budget location startDate');

    res.json(projects);
  } catch (error) {
    console.error('Get active projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/volunteers/:id/approve
// @desc    Approve volunteer application
// @access  Private (Admin only)
router.post('/volunteers/:id/approve', adminAuth, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.status = 'approved';
    await volunteer.save();

    res.json({
      success: true,
      message: 'Volunteer application approved',
      volunteer
    });
  } catch (error) {
    console.error('Approve volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/volunteers/:id/reject
// @desc    Reject volunteer application
// @access  Private (Admin only)
router.post('/volunteers/:id/reject', adminAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    volunteer.status = 'rejected';
    if (reason) volunteer.notes = reason;
    await volunteer.save();

    res.json({
      success: true,
      message: 'Volunteer application rejected',
      volunteer
    });
  } catch (error) {
    console.error('Reject volunteer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports/donations
// @desc    Get donation reports
// @access  Private (Admin only)
router.get('/reports/donations', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;

    const matchStage = { paymentStatus: 'completed' };
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupStage;
    if (groupBy === 'month') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        }
      };
    } else if (groupBy === 'day') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        }
      };
    }

    const donations = await Donation.aggregate([
      { $match: matchStage },
      {
        $group: {
          ...groupStage,
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          avgAmount: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json(donations);
  } catch (error) {
    console.error('Get donation reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports/volunteers
// @desc    Get volunteer reports
// @access  Private (Admin only)
router.get('/reports/volunteers', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const volunteers = await Volunteer.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: ['$emailConfirmed', 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json(volunteers);
  } catch (error) {
    console.error('Get volunteer reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
