import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';
import { LookbookPost } from './models/LookbookPost.js';
import { connectDB } from './config/db.js';

dotenv.config();

const INITIAL_PRODUCTS = [
  {
    name: 'ONYX HEAVYWEIGHT OVERSIZED TEE',
    subtitle: '280 GSM Combed French Terry Cotton',
    price: 1299,
    originalPrice: 1999,
    fit: 'Oversized',
    gsm: 280,
    material: '100% Organic Heavyweight Cotton',
    description: 'The definitive silhouette. Built from dense 280 GSM combed cotton that creates a structured drape without clinging. Finished with a tight ribbed collar designed never to bacon.',
    features: [
      'Pre-shrunk 0% Steam Finished',
      'Dropped shoulder architectural drape',
      'High-retention 1.25" rib collar',
      'Blind-stitched sleeves and hem',
      'Pre-washed with organic pumice stone'
    ],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 24 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 18 },
      { size: 'XXL', stock: 8 },
      { size: '3XL', stock: 4 }
    ],
    rating: 4.95,
    reviewsCount: 342,
    isBestSeller: true,
    tag: 'SIGNATURE DROP'
  },
  {
    name: 'OBSIDIAN BOXYFIT ESSENTIAL TEE',
    subtitle: '260 GSM Japanese Ring-Spun Cotton',
    price: 1399,
    originalPrice: 1899,
    fit: 'BoxyFit',
    gsm: 260,
    material: '100% Japanese Ring-Spun Cotton',
    description: 'A modern boxy proportion cut wider across the torso with shortened vertical body length to pair cleanly with relaxed trousers and cargos.',
    features: [
      'Square torso block with relaxed chest',
      'Slightly shortened body length',
      'Wide-cut sleeves resting past elbow',
      'Reinforced shoulder-to-shoulder taping'
    ],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }
    ],
    rating: 4.9,
    reviewsCount: 189,
    tag: 'BOXYFIT'
  },
  {
    name: 'ACID FADE PHANTOM STANDARD TEE',
    subtitle: '240 GSM Mineral Acid-Washed Cotton',
    price: 1499,
    originalPrice: 2199,
    fit: 'Standard',
    gsm: 240,
    material: '100% Combed Cotton Mineral Fade',
    description: 'Classic tailored silhouette with handcrafted mineral acid fade wash. Every single piece exhibits unique dark graphite highs and midnight black shadows.',
    features: [
      'Individually hand acid-treated',
      'Tailored standard torso drape',
      'Reinforced shoulder-to-shoulder taped seams'
    ],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 22 },
      { size: 'XL', stock: 12 }
    ],
    rating: 4.88,
    reviewsCount: 154,
    tag: 'ACID WASH'
  },
  {
    name: 'MONOLITH GYM T-SHIRT SCULPTED ATHLETIC',
    subtitle: '230 GSM Stretch Gym T-Shirt Performance Blend',
    price: 1199,
    originalPrice: 1699,
    fit: 'Gym T-shirt',
    gsm: 230,
    material: '92% Supima Cotton, 8% Spandex Performance Blend',
    description: 'Engineered specifically for bodybuilding, weightlifting, and athletic training. Fitted across shoulders, chest, and arms with a tapered waist for zero bulk during motion.',
    features: [
      '230 GSM 4-Way Micro-Stretch Gym Weave',
      'Sculpted athletic taper across biceps and chest',
      'Sweat-wicking interior yarn structure'
    ],
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85'
    ],
    sizes: [
      { size: 'S', stock: 14 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 10 }
    ],
    rating: 4.92,
    reviewsCount: 118,
    tag: 'GYM T-SHIRT'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding initial BlackFits catalog into MongoDB Atlas...');

    // Clear existing
    await Product.deleteMany();
    await LookbookPost.deleteMany();

    const createdProducts = await Product.insertMany(INITIAL_PRODUCTS);
    console.log(`✅ Seeded ${createdProducts.length} Products!`);

    const lookbookData = [
      {
        image: '/images/lookbook/oversized_model.png',
        caption: 'Tokyo night walk in the 280 GSM Onyx Oversized. Architectural drape that never loses shape.',
        likes: 1240,
        productId: createdProducts[0]._id.toString(),
        productName: createdProducts[0].name,
        fitTag: 'Oversized'
      },
      {
        image: '/images/lookbook/boxyfit_model.png',
        caption: 'Clean proportions. BoxyFit with wide sleeves layered over heavy cargos.',
        likes: 890,
        productId: createdProducts[1]._id.toString(),
        productName: createdProducts[1].name,
        fitTag: 'BoxyFit'
      },
      {
        image: '/images/lookbook/standard_model.png',
        caption: 'Subtle mineral wash nuances. The Acid Fade Phantom in direct daylight.',
        likes: 2150,
        productId: createdProducts[2]._id.toString(),
        productName: createdProducts[2].name,
        fitTag: 'Standard'
      },
      {
        image: '/images/lookbook/oversized_model1.png',
        caption: 'Elevated mockneck. Designed for blazers and raw denim pairing.',
        likes: 1530,
        productId: createdProducts[3]._id.toString(),
        productName: createdProducts[3].name,
        fitTag: 'Gym T-shirt'
      }
    ];

    await LookbookPost.insertMany(lookbookData);
    console.log(`✅ Seeded ${lookbookData.length} Lookbook Posts!`);

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
