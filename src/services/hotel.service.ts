import { Hotel, HotelImage, Room, sequelize, User } from '../models';
import { AppError } from '../utils/AppError';

export class HotelService {
  /**
   * 有 ID 则更新，无 ID 则创建
   * 接口：/merchant/hotels
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
      
      // 构造酒店主表数据
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

      // 同步酒店图片 (先删除旧数据，再批量插入)
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

      // 同步房型信息
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


  /**
   * 获取商户自己的酒店列表
   * GET /api/merchant/hotels?page=1&pageSize=10
   */
  static async getMerchantHotels(merchantId: number, query: { page?: number; pageSize?: number }) {
    // 解析分页参数
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Number(query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // 带有计数的查询
    const { count, rows } = await Hotel.findAndCountAll({
      where: { merchant_id: merchantId },
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: HotelImage,
          as: 'images',
          where: { is_primary: true }, // 仅拉取首图
          required: false,
          attributes: ['image_url']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // 数据映射
    const list = rows.map(hotel => {
      const h = hotel.toJSON();
      return {
        id: h.id.toString(),
        name: h.name_zh,           // name_zh -> name 
        address: h.address,
        phone: h.contact_phone,    // contact_phone -> phone 
        hotelType: h.hotel_type,
        status: h.status,
        firstImage: h.images?.[0]?.image_url || "" // 主图URL -> firstImage 
      };
    });

    // 返回符合文档要求的 data 结构 
    return {
      list,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize)
    };
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
    // 确保该酒店确实属于该商户
    const hotel = await Hotel.findOne({
      where: { id: hotelId, merchant_id: merchantId }
    });

    if (!hotel) {
      throw new AppError('未找到相关酒店信息，无权操作', 403);
    }

    // 找到对应的房型
    const room = await Room.findOne({
      where: { id: roomId, hotel_id: hotelId }
    });

    if (!room) {
      throw new AppError('未找到该房型信息', 404);
    }

    // 更新
    // 不修改酒店的 status，不会触发重新审核
    await room.update({ total_stock: newStock });

    return room;
  }

/**
   * 管理员获取全局酒店列表 
   * /admin/hotels?page=1&pageSize=10
   */
  static async getAdminHotels(query: { page?: number; pageSize?: number }) {
    // 处理分页参数，pageSize 可选值：5, 10, 20, 50 
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Number(query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // 查询数据并关联商户名与主图
    const { count, rows } = await Hotel.findAndCountAll({
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: User,
          as: 'merchant',
          attributes: ['username'] // 获取 merchantName 
        },
        {
          model: HotelImage,
          as: 'images',
          where: { is_primary: true },
          required: false, // 没有主图也返回酒店信息
          attributes: ['image_url'] // 获取 firstImage 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // 数据映射：将数据库字段转换为前端字段名 
    const list = rows.map(hotel => {
      const h = hotel.toJSON();
      return {
        id: h.id.toString(),
        name: h.name_zh, // name_zh 映射为 name
        address: h.address,
        phone: h.contact_phone,
        merchantName: h.merchant?.username || '未知商户',  
        status: h.status,
        rejectReason: h.rejection_reason || null,  
        firstImage: h.images?.[0]?.image_url || ""  
      };
    });

    // 返回文档要求的响应结构 
    return {
      list,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize)
    };
  }


    /**
   * 审核酒店逻辑
   */
  static async auditHotel(params: {
    hotelId: number;
    adminId: number;
    status: 'approved' | 'rejected';
    rejectReason?: string;
  }) {
    const { hotelId, adminId, status, rejectReason } = params;

    return await sequelize.transaction(async (t) => {
      // 查找酒店并锁定行（防止并发审核）
      const hotel = await Hotel.findByPk(hotelId, { transaction: t });
      if (!hotel) throw new AppError('酒店不存在', 404);

      // 只有 pending 状态能审核
      if (hotel.status !== 'pending') {
        throw new AppError('只有待审核状态的酒店才能执行此操作', 400);
      }

      // 更新酒店状态
      await hotel.update({
        status: status,
        rejection_reason: status === 'rejected' ? rejectReason : null
      }, { transaction: t });

      // 记录审计日志
      await (sequelize.models.AuditLog as any).create({
        hotel_id: hotelId,
        admin_id: adminId,
        action: status === 'approved' ? 'approve' : 'reject',
        reason: rejectReason || '审批通过'
      }, { transaction: t });

      return true;
    });
  }

  /**
 * 切换酒店上下线状态
 * 仅允许对已发布(approved)或已下线(offline)的酒店进行操作 
 */
  static async toggleHotelStatus(params: {
    hotelId: number;
    adminId: number;
    targetStatus: 'approved' | 'offline';
  }) {
    const { hotelId, adminId, targetStatus } = params;

    return await sequelize.transaction(async (t) => {
      // 查找酒店
      const hotel = await Hotel.findByPk(hotelId, { transaction: t });
      if (!hotel) throw new AppError('酒店不存在', 404);

      // 状态校验：只有 approved 或 offline 状态能切换 
      const allowedStatuses = ['approved', 'offline'];
      if (!allowedStatuses.includes(hotel.status)) {
        throw new AppError('只有已发布或已下线的酒店才能执行此操作', 400);
      }

      // 更新状态
      await hotel.update({
        status: targetStatus
      }, { transaction: t });

      // 记录审计日志
      const actionMap = {
        'offline': 'offline',
        'approved': 'online'
      };
      
      await (sequelize.models.AuditLog as any).create({
        hotel_id: hotelId,
        admin_id: adminId,
        action: actionMap[targetStatus],
        reason: targetStatus === 'offline' ? '管理员执行强制下线' : '管理员恢复上线'
      }, { transaction: t });

      return true;
    });
  }




}