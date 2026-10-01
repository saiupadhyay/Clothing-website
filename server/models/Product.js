import mongoose from 'mongoose';

const sizeStockSchema = new mongoose.Schema({
  size: { 
    type: String, 
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], 
    required: true 
  },
  stock: { type: Number, default: 10, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  customId: {
    type: String,
    sparse: true,
    trim: true,
    index: true
  },
  name: { 
    type: String, 
    required: [true, 'Please provide product name'], 
    trim: true, 
    uppercase: true 
  },
  subtitle: { 
    type: String, 
    default: '280 GSM Combed French Terry Cotton' 
  },
  price: { 
    type: Number, 
    required: [true, 'Please provide selling price in INR'], 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    min: 0 
  },
  fit: { 
    type: String, 
    enum: ['Standard', 'Oversized', 'BoxyFit', 'Gym T-shirt'], 
    required: [true, 'Please specify fit type'] 
  },
  gsm: { 
    type: Number, 
    default: 280 
  },
  material: { 
    type: String, 
    default: '100% Organic Heavyweight Cotton' 
  },
  description: { 
    type: String, 
    default: 'Engineered with 100% pre-shrunk reactive black cotton for daily heavy rotation.' 
  },
  features: {
    type: [String],
    default: [
      'Pre-shrunk 0% Steam Finished',
      '280 GSM Heavyweight Structure',
      'Double-stitched rib collar'
    ]
  },
  images: [{ 
    type: String, 
    required: true 
  }],
  sizes: [sizeStockSchema],
  rating: { 
    type: Number, 
    default: 5.0 
  },
  reviewsCount: { 
    type: Number, 
    default: 0 
  },
  isNewDrop: { 
    type: Boolean, 
    default: true 
  },
  isBestSeller: { 
    type: Boolean, 
    default: false 
  },
  tag: { 
    type: String, 
    default: 'NEW RELEASE' 
  }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
