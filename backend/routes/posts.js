const express = require('express');
const router = express.Router();
const axios = require('axios');
const Post = require('../models/Post');

const JSONPLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com/posts';

// POST /api/posts/fetch
router.post('/fetch', async (req, res) => {
  try {
    // Delete old posts
    await Post.deleteMany({});

    // Fetch from public API
    const response = await axios.get(JSONPLACEHOLDER_URL);
    const posts = response.data;

    const operations = posts.map((post) => ({
      updateOne: {
        filter: { id: post.id },
        update: { 
          $set: {
            id: post.id,
            userId: post.userId,
            title: post.title,
            body: post.body,
            // Generate mock likes/views so trending still works
            likes: Math.floor(Math.random() * 1000),
            views: Math.floor(Math.random() * 5000)
          }
        },
        upsert: true,
      },
    }));

    const result = await Post.bulkWrite(operations);

    res.json({
      success: true,
      message: `Successfully fetched and seeded ${posts.length} posts from JSONPlaceholder!`,
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error seeding posts from public API:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to sync with public API',
      error: error.message,
    });
  }
});

// GET /api/posts — Get all posts from MongoDB
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 100, sort = 'recent' } = req.query;
    
    // Sort by descending likes if trending, else by id
    const sortConfig = sort === 'trending' ? { likes: -1 } : { id: 1 };

    const posts = await Post.find()
      .sort(sortConfig)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Post.countDocuments();

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts',
      error: error.message,
    });
  }
});

// POST /api/posts — Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, body } = req.body;
    
    // Generate a unique ID for the new post (mock approach: find max id + 1)
    const lastPost = await Post.findOne().sort({ id: -1 });
    const newId = lastPost ? lastPost.id + 1 : 1;
    
    // Mock user id (e.g. 1)
    const userId = 1;

    const newPost = new Post({
      id: newId,
      userId,
      title,
      body,
      likes: 0,
      views: 0
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message,
    });
  }
});

// GET /api/posts/:id — Get a single post by its JSONPlaceholder ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({ id: Number(req.params.id) });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with id ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch post',
      error: error.message,
    });
  }
});

// DELETE /api/posts/:id — Delete a post by its JSONPlaceholder ID
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ id: Number(req.params.id) });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with id ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      message: `Post ${req.params.id} deleted successfully`,
      data: post,
    });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      error: error.message,
    });
  }
});

module.exports = router;
