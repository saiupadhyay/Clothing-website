import express from 'express';
import {
  createOrder,
  getOrders,
  getMyOrders,
  trackOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-orders', protect, getMyOrders);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/track/:identifier')
  .get(trackOrder);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
