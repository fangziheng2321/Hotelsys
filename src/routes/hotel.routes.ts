import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';
import { upload } from '../config/multer';

const router = Router();

// 酒店录入：需要登录，且必须是商户角色 [cite: 66]
router.post(
  '/hotels', 
  protect, 
  restrictTo('merchant'), 
  hotelController.createHotel
);

// 酒店更新：需要登录，商户或管理员可操作
router.patch(
  '/hotels/:id',
  protect,
  restrictTo('merchant', 'admin'),
  hotelController.updateHotel
);

// 酒店图片批量上传 (最多上传 5 张)
router.post(
  '/:id/images',
  protect,
  restrictTo('merchant'),
  upload.array('images', 5), 
  hotelController.uploadHotelImages
);

export default router;