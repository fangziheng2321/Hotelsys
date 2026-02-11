import { Request, Response, NextFunction } from 'express';
import { HotelService } from '../services/hotel.service';
import { ValidationError } from '../utils/AppError';

/**
 * 保存酒店信息
 * 有 id 时为更新，无 id 时为创建 
 */
// src/controllers/hotel.controller.ts
export const saveHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const merchantId = (req as any).user.id; 

    // 捕捉返回结果
    const result = await HotelService.saveHotel(req.body, merchantId);

    // 按照接口文档要求的格式返回
    res.status(200).json({
      success: true,
      message: "酒店保存成功",
      data: result
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
    // 从 protect 中间件获取当前登录商户的 ID
    const merchantId = (req as any).user.id;

    const hotels = await HotelService.getMerchantHotels(merchantId);

    res.status(200).json({
      success: true,
      data: hotels
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
    const { roomId, stock } = req.body;

    if (stock === undefined || stock < 0) {
      throw new ValidationError('库存数量不合法'); 
    }

    const updatedRoom = await HotelService.updateRoomStock(hotelId, roomId, merchantId, stock);

    res.status(200).json({
      success: true,
      message: '库存更新成功',
      data: {
        roomId: updatedRoom.id,
        currentStock: updatedRoom.total_stock
      }
    });
  } catch (error) {
    next(error); 
  }
};