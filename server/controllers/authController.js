import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'blackfits_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new customer or admin (with optional adminPasscode)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, preferredFit, preferredSize, adminPasscode } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Determine role: if secret admin passcode matches, grant admin role
    const masterAdminPasscode = process.env.ADMIN_PASSCODE || 'BLACKFITS_ADMIN_2026';
    const role = (adminPasscode && adminPasscode.trim() === masterAdminPasscode) ? 'admin' : 'customer';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone || '',
      role,
      preferredFit: preferredFit || 'Oversized',
      preferredSize: preferredSize || 'L'
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        preferredFit: user.preferredFit,
        preferredSize: user.preferredSize,
        addresses: user.addresses || [],
        preferredPaymentMethod: user.preferredPaymentMethod || 'Credit / Debit Card',
        savedCard: user.savedCard || null,
        savedUpiId: user.savedUpiId || ''
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login customer or admin
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        preferredFit: user.preferredFit,
        preferredSize: user.preferredSize,
        addresses: user.addresses || [],
        preferredPaymentMethod: user.preferredPaymentMethod || 'Credit / Debit Card',
        savedCard: user.savedCard || null,
        savedUpiId: user.savedUpiId || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        preferredFit: user.preferredFit,
        preferredSize: user.preferredSize,
        addresses: user.addresses || [],
        preferredPaymentMethod: user.preferredPaymentMethod || 'Credit / Debit Card',
        savedCard: user.savedCard || null,
        savedUpiId: user.savedUpiId || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current authenticated user profile & addresses & payment method
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      phone,
      preferredFit,
      preferredSize,
      addresses,
      preferredPaymentMethod,
      savedCard,
      savedUpiId
    } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (preferredFit !== undefined) user.preferredFit = preferredFit;
    if (preferredSize !== undefined) user.preferredSize = preferredSize;
    if (addresses !== undefined) user.addresses = addresses;
    if (preferredPaymentMethod !== undefined) user.preferredPaymentMethod = preferredPaymentMethod;
    if (savedCard !== undefined) user.savedCard = savedCard;
    if (savedUpiId !== undefined) user.savedUpiId = savedUpiId;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        preferredFit: user.preferredFit,
        preferredSize: user.preferredSize,
        addresses: user.addresses || [],
        preferredPaymentMethod: user.preferredPaymentMethod || 'Credit / Debit Card',
        savedCard: user.savedCard || null,
        savedUpiId: user.savedUpiId || ''
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
