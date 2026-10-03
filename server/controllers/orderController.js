import { Order } from '../models/Order.js';
import jwt from 'jsonwebtoken';

// @desc    Create new customer order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const orderNumber = req.body.orderNumber || req.body.id || `BF-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let userId = req.body.user;
    let guestEmail = req.body.guestEmail;

    // If bearer token is provided, extract user id
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'blackfits_secret_key_2026');
        userId = decoded.id;
      } catch (e) {}
    }

    const trackingSteps = req.body.trackingSteps && req.body.trackingSteps.length > 0 
      ? req.body.trackingSteps 
      : [
          { status: 'Order Placed', date: dateStr, location: 'Website Checkout', completed: true, current: true },
          { status: 'Quality Check & Packing', date: 'Pending', location: 'BlackFits Central Vault, Mumbai', completed: false },
          { status: 'Dispatched', date: 'Pending', location: 'Logistics Hub', completed: false },
          { status: 'Out for Delivery', date: 'Pending', location: 'Local Courier', completed: false },
          { status: 'Delivered', date: 'Estimated 3-4 days', location: 'Shipping Address', completed: false }
        ];

    const order = await Order.create({
      ...req.body,
      orderNumber,
      user: userId || undefined,
      guestEmail: guestEmail || (req.body.shippingAddress && req.body.shippingAddress.email) || undefined,
      trackingSteps
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const query = {
      $or: [
        { user: req.user._id }
      ]
    };
    if (req.user.email) {
      query.$or.push({ guestEmail: req.user.email.toLowerCase().trim() });
    }
    if (req.user.phone) {
      query.$or.push({ 'shippingAddress.phone': req.user.phone });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order by trackingNumber or orderNumber
// @route   GET /api/orders/track/:identifier
export const trackOrder = async (req, res) => {
  try {
    const { identifier } = req.params;
    const order = await Order.findOne({
      $or: [
        { trackingNumber: identifier },
        { orderNumber: identifier }
      ]
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order or tracking number not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status & tracking step (Admin)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Mark current steps
    const stepOrder = [
      'Order Placed', 
      'Quality Check & Packing', 
      'Dispatched', 
      'Out for Delivery', 
      'Delivered'
    ];
    const targetIdx = stepOrder.indexOf(status);

    if (targetIdx !== -1) {
      order.trackingSteps = order.trackingSteps.map((step, idx) => {
        if (idx < targetIdx) return { ...step, completed: true, current: false };
        if (idx === targetIdx) return { ...step, completed: true, current: true, date: dateStr, location: location || step.location };
        return { ...step, completed: false, current: false };
      });
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
