import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  productIdStr: { type: String },
  name: { type: String, required: true },
  size: { 
    type: String, 
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], 
    required: true 
  },
  fit: { 
    type: String, 
    enum: ['Standard', 'Oversized', 'BoxyFit', 'Gym T-shirt'], 
    required: true 
  },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
}, { _id: false });

const trackingStepSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  completed: { type: Boolean, default: false },
  current: { type: Boolean, default: false }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  guestEmail: { type: String },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true }
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
      'Order Placed', 
      'Quality Check & Packing', 
      'Dispatched', 
      'Out for Delivery', 
      'Delivered', 
      'Cancelled'
    ], 
    default: 'Order Placed' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Credit / Debit Card', 'Razorpay / UPI', 'Apple Pay / Google Pay', 'Cash on Delivery'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Refunded'], 
    default: 'Paid' 
  },
  trackingNumber: { type: String, default: () => `BFX-${Math.floor(10000000 + Math.random() * 90000000)}IN` },
  carrier: { type: String, default: 'BlackFits Express Logistics' },
  estimatedDelivery: { type: String, default: '3-4 Business Days' },
  trackingSteps: [trackingStepSchema]
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
