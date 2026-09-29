import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import lookbookRoutes from './routes/lookbookRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'BlackFits E-Commerce API',
    database: 'MongoDB Atlas',
    mediaDelivery: 'Cloudinary CDN',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lookbook', lookbookRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║          BLACKFITS LUXURY STREETWEAR BACKEND API           ║
  ╠════════════════════════════════════════════════════════════╣
  ║  📡 Port: http://localhost:${PORT}                           ║
  ║  🗄️  Database: MongoDB Atlas (via Mongoose)                 ║
  ║  ☁️  CDN Images: Cloudinary Global Delivery                ║
  ║  🛡️  Security: CORS enabled for ${process.env.CLIENT_URL || 'http://localhost:5173'}     ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});
