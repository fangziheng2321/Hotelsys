import { Hotel, HotelImage, Room, sequelize } from '../models';
import { AppError } from '../utils/AppError';

export class HotelService {
  /**
   * 有 ID 则更新，无 ID 则创建
   * 接口：/merchant/hotels [cite: 116]
   */
  static async saveHotel(payload: any, merchantId: number) {
    const { 
      id, 
      name, 
      address, 
      phone, 
      description, 
      starRating, 
      amenities, 
      hotelType, 
      images, 
      roomTypes 
    } = payload;

    // 使用非托管事务，确保多表操作的原子性
    return await sequelize.transaction(async (t) => {
      let hotel;
      
      // 1. 构造酒店主表数据 (映射前端字段到数据库模型) 
      const hotelData: any = {
        name_zh: name,
        address,
        contact_phone: phone,
        description,
        star_rating: starRating,
        facilities: amenities, 
        hotel_type: hotelType || 'domestic',
        merchant_id: merchantId,
        status: 'pending', // 保存即进入审核状态
        rejection_reason: null // 重置之前的拒绝原因
      };

      if (id) {
        // 更新：必须校验归属权，防止 A 商户通过 ID 修改 B 商户的酒店
        hotel = await Hotel.findOne({ 
          where: { id, merchant_id: merchantId }, 
          transaction: t 
        });
        
        if (!hotel) throw new AppError('酒店不存在或无权操作', 404);
        await hotel.update(hotelData, { transaction: t });
      } else {
        // 创建
        hotel = await Hotel.create(hotelData, { transaction: t });
      }

      // 2. 同步酒店图片 (先删除旧数据，再批量插入)
      if (images && Array.isArray(images)) {
        await HotelImage.destroy({ where: { hotel_id: hotel.id }, transaction: t });
        
        const imageData = images.map((url: string, index: number) => ({
          hotel_id: hotel.id,
          image_url: url,
          is_primary: index === 0, // 默认第一张为主图
          uploaded_by: merchantId
        }));
        
        await HotelImage.bulkCreate(imageData, { transaction: t });
      }

      // 3. 同步房型信息
      if (roomTypes && Array.isArray(roomTypes)) {
        await Room.destroy({ where: { hotel_id: hotel.id }, transaction: t });
        
        const roomData = roomTypes.map((room: any) => ({
          hotel_id: hotel.id,
          name: room.name,            
          bed_type: room.bedType,     
          room_size: room.roomSize,   
          capacity: room.capacity,    
          floor: room.floor,          
          image_url: room.image,      
          total_stock: room.roomCount || 10,
          current_price: room.price || 0,
          is_active: true
        }));
        
        await Room.bulkCreate(roomData, { transaction: t });
      }

      return { id: hotel.id };
    });
  }


  //获取指定商户名下的酒店列表
  static async getMerchantHotels(merchantId: number) {
    return await Hotel.findAll({
      where: { merchant_id: merchantId },
      // 包含关联的图片和房型
      include: [
        {
          model: HotelImage,
          as: 'images',
          attributes: ['image_url', 'is_primary'],
          limit: 1 // 列表页通常只需要一张封面图
        },
        {
          model: Room,
          as: 'roomTypes',
          attributes: ['current_price'] // 用于计算起价
        }
      ],
      order: [['created_at', 'DESC']] // 按创建时间倒序排列
    });
  }

  /**
   * 获取酒店完整详情（含图片和房型）
   * 使用merchantId 校验，确保商户只能看到自己的酒店详情
   */
  static async getHotelDetail(id: number, merchantId: number) {
    const hotel = await Hotel.findOne({
      where: { id, merchant_id: merchantId },
      include: [
        {
          model: HotelImage,
          as: 'images',
          attributes: ['image_url', 'is_primary', 'image_type']
        },
        {
          model: Room,
          as: 'roomTypes',
          attributes: ['id', 'name', 'bed_type', 'room_size', 'capacity', 'floor', 'image_url', 'current_price']
        }
      ]
    });

    if (!hotel) {
      throw new AppError('未找到该酒店或无权访问', 404);
    }

    return hotel;
  }


  /**
   * 更新房间库存
   * 校验酒店归属权 -> 校验房型归属权 -> 仅更新库存
   */
  static async updateRoomStock(hotelId: number, roomId: number, merchantId: number, newStock: number) {
    // 1. 确保该酒店确实属于该商户
    const hotel = await Hotel.findOne({
      where: { id: hotelId, merchant_id: merchantId }
    });

    if (!hotel) {
      throw new AppError('未找到相关酒店信息，无权操作', 403);
    }

    // 2. 找到对应的房型
    const room = await Room.findOne({
      where: { id: roomId, hotel_id: hotelId }
    });

    if (!room) {
      throw new AppError('未找到该房型信息', 404);
    }

    // 3. 更新
    // 不修改酒店的 status，不会触发重新审核
    await room.update({ total_stock: newStock });

    return room;
  }
}