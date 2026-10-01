import mongoose from 'mongoose';
import { Product } from '../models/Product.js';

// @desc    Get all products (with optional filter by fit, search)
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { fit, search } = req.query;
    const query = {};

    if (fit && fit !== 'All') {
      query.fit = fit;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID or customId
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({
        $or: [
          { customId: id },
          { name: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') }
        ]
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.id && !payload.customId) {
      payload.customId = payload.id;
    }
    delete payload._id; // Ensure clean creation with Mongoose ObjectId
    const product = await Product.create(payload);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update product by ID or customId (or upsert if mock)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!product) {
      product = await Product.findOneAndUpdate(
        {
          $or: [
            { customId: id },
            { name: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') }
          ]
        },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    // If still not found, create it with customId so user edits are NEVER lost
    if (!product) {
      const payload = { ...req.body, customId: id };
      delete payload._id;
      product = await Product.create(payload);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product by ID or customId
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findByIdAndDelete(id);
    }

    if (!product) {
      product = await Product.findOneAndDelete({
        $or: [
          { customId: id },
          { name: new RegExp(`^${id.replace(/-/g, ' ')}$`, 'i') }
        ]
      });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted from catalog' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
