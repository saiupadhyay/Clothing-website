import mongoose from 'mongoose';

const lookbookSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: [true, 'Please provide street photo URL from Cloudinary'] 
  },
  caption: { 
    type: String, 
    required: [true, 'Please provide lookbook quote / caption'] 
  },
  likes: { 
    type: Number, 
    default: 1200 
  },
  productId: { 
    type: String, 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  fitTag: { 
    type: String, 
    enum: ['Standard', 'Oversized', 'BoxyFit', 'Gym T-shirt'], 
    required: true,
    default: 'Oversized'
  }
}, { timestamps: true });

export const LookbookPost = mongoose.model('LookbookPost', lookbookSchema);
