import { LookbookPost } from '../models/LookbookPost.js';

// @desc    Get all community lookbook posts (optional filter by fitTag)
// @route   GET /api/lookbook
export const getLookbookPosts = async (req, res) => {
  try {
    const { fit } = req.query;
    const query = {};
    if (fit && fit !== 'All') {
      query.fitTag = fit;
    }
    const posts = await LookbookPost.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new street lookbook post
// @route   POST /api/lookbook
export const createLookbookPost = async (req, res) => {
  try {
    const post = await LookbookPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update lookbook post
// @route   PUT /api/lookbook/:id
export const updateLookbookPost = async (req, res) => {
  try {
    const post = await LookbookPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete lookbook post
// @route   DELETE /api/lookbook/:id
export const deleteLookbookPost = async (req, res) => {
  try {
    const post = await LookbookPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Lookbook post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
