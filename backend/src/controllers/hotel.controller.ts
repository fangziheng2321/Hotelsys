import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../services/hotel.service';
import { ValidationError } from '../utils/AppError';
import { AppError } from '../utils/AppError';

/**
 * 保存酒店信息
 * 有 id 时为更新，无 id 时为创建 
 */
// src/controllers/hotel.controller.ts
export const saveHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = (req as any).user.id; 

    await HotelService.saveHotel(req.body, merchantId);

    res.status(200).json({
      success: true,
      message: "酒店保存成功"
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 获取商户自己的酒店列表
 */
export const getMerchantHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = (req as any).user.id;
    const { page, pageSize, hotelType, status, search } = req.query;

    const result = await HotelService.getMerchantHotels(merchantId, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      hotelType: hotelType as string, 
      status: status as string,
      search: search as string 
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 获取酒店回显详情
 */
export const getHotelDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const merchantId = (req as any).user.id;

    const hotel = await HotelService.getHotelDetail(Number(id), merchantId);

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 更新房型库存
 */
export const updateRoomStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotelId = Number(req.params.id);
    const merchantId = (req as any).user.id;
    const { roomTypes } = req.body; 

    if (!Array.isArray(roomTypes)) {
      throw new AppError('无效的请求格式，roomTypes 必须为数组', 400);
    }

    await HotelService.updateRoomStock(hotelId, merchantId, roomTypes);

    res.status(200).json({
      success: true,
      message: '房间数量更新成功'
    });
  } catch (error) {
    next(error); 
  }
};

/**
 * 管理员获取全局酒店列表 
 */
export const getAdminHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize, hotelType, status, search } = req.query;

    const result = await HotelService.getAdminHotels({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      hotelType: hotelType as string, 
      status: status as string,
      search: search as string        
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 管理员：获取指定酒店详情
 */
export const getAdminHotelDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const hotel = await HotelService.getAdminHotelDetail(Number(id));

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 管理员审核酒店接口
 */
export const auditHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, rejectReason } = req.body;
    const adminId = (req as any).user.id;

    const hotelId = Number(id);
    if (isNaN(hotelId)) {
      throw new AppError(`无效的酒店ID参数: ${id}`, 400); 
    }

    // 基础参数校验
    if (!['approved', 'rejected'].includes(status)) {
      throw new AppError('无效的审核状态', 400);
    }
    if (status === 'rejected' && !rejectReason) {
      throw new AppError('拒绝酒店时必须填写原因', 400);
    }

    await HotelService.auditHotel({
      hotelId,
      adminId,
      status,
      rejectReason
    });

    res.status(200).json({
      success: true,
      message: "审核操作成功" 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 管理员：切换酒店上下线状态
 */
export const toggleHotelStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Body 为 { "status": "offline" } 
    const adminId = (req as any).user.id;

    // 校验 ID 类型
    const hotelId = Number(id);
    if (isNaN(hotelId)) {
      throw new AppError(`无效的酒店ID: ${id}`, 400);
    }

    // 校验目标状态是否合法
    if (!['approved', 'offline'].includes(status)) {
      throw new AppError('非法的状态切换请求', 400);
    }

    // 调用 Service
    await HotelService.toggleHotelStatus({
      hotelId,
      adminId,
      targetStatus: status as 'approved' | 'offline'
    });

    // 返回成功消息 
    res.status(200).json({
      success: true,
      message: "状态更新成功"
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 用户端：搜索酒店
 */
export const searchHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 校验参数
    const { currentPage, pageSize } = req.body;
    if (!currentPage || !pageSize) {
      throw new AppError('currentPage 和 pageSize 为必填项', 400);
    }

    const result = await HotelService.searchHotels(req.body);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 商户：获取可视化统计数据
 */
export const getMerchantVisualization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = (req as any).user.id;

    const stats = await HotelService.getMerchantVisualization(merchantId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 管理员：获取全平台可视化统计数据
 */
export const getAdminVisualization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await HotelService.getAdminVisualization();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};