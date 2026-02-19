// src/routes/admin.routes.ts
import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// 管理员获取酒店列表
router.get(
  '/hotels', 
  protect, 
  restrictTo('admin'), 
  hotelController.getAdminHotels
);

// 审核酒店
router.post(
  '/hotels/:id/audit', 
  protect, 
  restrictTo('admin'), 
  hotelController.auditHotel
);

// 上下线酒店 
router.post(
  '/hotels/:id/toggle-status',
  protect,
  restrictTo('admin'),
  hotelController.toggleHotelStatus
);

export default router;