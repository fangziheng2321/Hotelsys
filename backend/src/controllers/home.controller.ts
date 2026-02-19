// src/controllers/home.controller.ts
import { Request, Response, NextFunction } from 'express';
import { HomeService } from '../services/home.service';
import { HotelService } from '../services/hotel.service'; 
import { AppError } from '../utils/AppError';
/**
 * 获取首页轮播图
 */
export const getHomeBanners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await HomeService.getHomeBanners();

    res.status(200).json({
      success: true,
      data: banners
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
    const { currentPage, pageSize } = req.body;

    // 参数校验
    if (!currentPage || !pageSize) {
      throw new AppError('currentPage 和 pageSize 为必填项', 400);
    }

    // 调用 HotelService 中的搜索逻辑
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
 * 用户端：获取酒店详情
 */
export const getHotelDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hotelId } = req.params;
    
    // 校验 ID 合法性
    const id = Number(hotelId);
    if (isNaN(id)) {
      throw new AppError('无效的酒店ID', 400);
    }

    const result = await HotelService.getHotelInfoForUser(id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};


/**
 * 用户端：获取房型列表
 */
export const getRoomList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hotelId } = req.params;
    const id = Number(hotelId);

    if (isNaN(id)) {
      throw new AppError('无效的酒店ID', 400); //
    }

    const rooms = await HotelService.getRoomListForUser(id);

    res.status(200).json({
      success: true,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};