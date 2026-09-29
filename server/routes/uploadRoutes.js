import express from 'express';
import { upload, cloudinary } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Upload single image to Cloudinary CDN
// @route   POST /api/upload/single
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // req.file.path contains the secure Cloudinary CDN URL
    res.json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.format,
      bytes: req.file.bytes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload multiple photos to Cloudinary CDN (e.g. for a product drop)
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('images', 8), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const uploaded = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      format: file.format,
      bytes: file.bytes
    }));

    res.json({
      success: true,
      count: uploaded.length,
      images: uploaded
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
