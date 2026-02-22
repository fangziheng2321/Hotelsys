// src/routes/admin.routes.ts
import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// 管理员获取酒店列表
router.get('/hotels', protect, restrictTo('admin'), hotelController.getAdminHotels);

// GET /api/admin/hotels/visualization
router.get('/hotels/visualization', protect, restrictTo('admin'), hotelController.getAdminVisualization);

// 管理员获取单个酒店详细信息
router.get('/hotels/:id', protect, restrictTo('admin'), hotelController.getAdminHotelDetail );

// 审核酒店
router.post('/hotels/:id/audit', protect, restrictTo('admin'), hotelController.auditHotel);

// 上下线酒店 
router.post('/hotels/:id/toggle-status',protect,restrictTo('admin'),hotelController.toggleHotelStatus);

export default router;