import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide full name'] 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide email'], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false 
  },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  preferredFit: { 
    type: String, 
    enum: ['Standard', 'Oversized', 'BoxyFit', 'Gym T-shirt'], 
    default: 'Oversized' 
  },
  preferredSize: { 
    type: String, 
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], 
    default: 'L' 
  },
  addresses: [addressSchema]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
