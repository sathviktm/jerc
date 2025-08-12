const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const { moderatorAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/news
// @desc    Get all news articles (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 6, category, search, featured } = req.query;
    
    const query = { status: 'published' };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const news = await News.find(query)
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await News.countDocuments(query);

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/news/:slug
// @desc    Get news article by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const article = await News.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'username');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Increment view count
    article.viewCount += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error('Get news article error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/news
// @desc    Create new news article
// @access  Private
router.post('/', [
  moderatorAuth,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').isIn(['conservation', 'events', 'achievements', 'education', 'research', 'community', 'general']).withMessage('Invalid category'),
  body('featuredImage.url').notEmpty().withMessage('Featured image URL is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newsData = {
      ...req.body,
      author: req.user._id
    };

    const news = new News(newsData);
    await news.save();

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      news
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/news/:id
// @desc    Update news article
// @access  Private
router.put('/:id', [
  moderatorAuth,
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').isIn(['conservation', 'events', 'achievements', 'education', 'research', 'community', 'general']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    Object.assign(news, req.body);
    await news.save();

    res.json({
      success: true,
      message: 'News article updated successfully',
      news
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news article
// @access  Private
router.delete('/:id', moderatorAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await News.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'News article deleted successfully'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/news/:id/status
// @desc    Update news article status
// @access  Private
router.put('/:id/status', [
  moderatorAuth,
  body('status').isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    news.status = status;
    if (status === 'published' && !news.publishedAt) {
      news.publishedAt = new Date();
    }
    await news.save();

    res.json({
      success: true,
      message: 'News article status updated successfully',
      news
    });
  } catch (error) {
    console.error('Update news status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
