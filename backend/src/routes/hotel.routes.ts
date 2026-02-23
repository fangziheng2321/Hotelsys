import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { idempotency } from '../middleware/idempotency.middleware';

const router = Router();

/**
 * 保存酒店（创建/更新）
 * POST /api/merchant/hotels
 */
router.post('/', protect, restrictTo('merchant'), idempotency(120), hotelController.saveHotel);

// 获取商户酒店列表
router.get('/getMerchantHotels', protect, restrictTo('merchant'), hotelController.getMerchantHotels);

// GET /api/merchant/hotels/visualization
router.get('/visualization', protect, restrictTo('merchant'), hotelController.getMerchantVisualization);

// 获取酒店回显详情
// GET /api/merchant/hotels/2
router.get('/:id', protect, restrictTo('merchant'), hotelController.getHotelDetail);

// 更新房间数量
// POST /api/merchant/hotels/:id/room-count
router.post('/:id/room-count', protect, restrictTo('merchant'), hotelController.updateRoomStock);
export default router; 

