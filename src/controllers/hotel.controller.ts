import { Request, Response, NextFunction } from 'express';
import Hotel from '../models/Hotel';
import HotelImage from '../models/HotelImage';
import { AppError } from '../utils/AppError';

/**
 * 1. 定义统一的认证请求接口
 * 显式扩展 Express 的 Request，确保编译器 100% 识别 user 属性
 */
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    role: 'admin' | 'merchant' | 'customer';
    username?: string;
    email?: string;
  };
}

/**
 * 中间件：检查用户是否已认证
 * 修改点：将参数类型改为 AuthenticatedRequest
 */
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest; // 显式断言
  if (!authReq.user) {
    return next(new AppError('请先登录', 401));
  }
  next();
};

/**
 * 中间件：检查用户权限
 * 修改点：通过类型断言确保访问 role 不报错
 */
const requireMerchantOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || (authReq.user.role !== 'merchant' && authReq.user.role !== 'admin')) {
    return next(new AppError('需要商家或管理员权限', 403));
  }
  next();
};

/**
 * 录入酒店信息
 */
export const createHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const newHotel = await Hotel.create({
      ...authReq.body,
      merchant_id: authReq.user.id, 
      status: 'pending' 
    });
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    next(error);
  }
};

/**
 * 修改酒店信息
 */
export const updateHotel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const hotel = await Hotel.findByPk(authReq.params.id);

    if (!hotel) {
      return next(new AppError('酒店未找到', 404));
    }

    if (hotel.merchant_id !== authReq.user.id && authReq.user.role !== 'admin') {
      return next(new AppError('您无权修改该酒店的信息', 403));
    }

    await hotel.update(authReq.body);
    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    next(error);
  }
};

/**
 * 上传酒店图片
 */
export const uploadHotelImages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest; // 关键修复：统一使用断言后的 authReq
    const hotelId = authReq.params.id;
    const files = authReq.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError('请选择要上传的图片', 400));
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return next(new AppError('酒店不存在', 404));
    
    // 修复点：使用 authReq.user 访问 id 和 role
    if (hotel.merchant_id !== authReq.user.id && authReq.user.role !== 'admin') {
      return next(new AppError('您无权为此酒店上传图片', 403));
    }

    const imageData = files.map((file, index) => ({
      hotel_id: parseInt(hotelId),
      image_url: `/uploads/hotels/${file.filename}`,
      image_type: authReq.body.image_type || 'other',
      is_primary: index === 0 && hotel.total_rooms === 0, 
      uploaded_by: authReq.user.id
    }));

    const images = await HotelImage.bulkCreate(imageData);

    res.status(201).json({
      success: true,
      data: images
    });
  } catch (error) {
    next(error);
  }
};

export { requireAuth, requireMerchantOrAdmin };