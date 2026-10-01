import express from 'express';

import { upload } from '../config/cloudinary.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

const router = express.Router();

// @desc    Upload single image to Cloudinary CDN
// @route   POST /api/upload/single
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload image buffer to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'blackfits/uploads'
    );

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
});


// @desc    Upload multiple photos to Cloudinary CDN
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Upload all images to Cloudinary
    const uploaded = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(
          file.buffer,
          'blackfits/uploads'
        );

        return {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes
        };
      })
    );

    res.json({
      success: true,
      count: uploaded.length,
      images: uploaded
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    });
  }
});

export default router;