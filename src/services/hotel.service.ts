import { Hotel, HotelImage, Room, sequelize, User } from '../models';
import { AppError } from '../utils/AppError';
import { Op, Sequelize } from 'sequelize';

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
        status: 'pending',
        rejection_reason: null
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
          bed_count: room.bedCount || 1,
          bed_size: room.bedSize || 1.80,          
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
    attributes: [
      'id', 'name_zh', 'address', 'city', 'district', 
      'latitude', 'longitude', 'star_rating', 'status', 
      'rejection_reason', 'contact_phone', 'facilities', 
      'description', 'hotel_type', 'is_featured'
    ],
    include: [
      {
        model: HotelImage,
        as: 'images',
        attributes: ['image_url', 'is_primary', 'image_type']
      },
      {
        model: Room,
        as: 'roomTypes',
        attributes: [
          'id', 'name', 'bed_count', 'bed_size', 
          'room_size', 'capacity', 'floor', 
          'image_url', 'current_price', 'total_stock'
        ]
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

  /**
   * 用户端：分页搜索酒店列表
   */
  static async searchHotels(params: any) {
    const { 
      location, 
      rate, 
      price, 
      facilities, 
      currentPage = 1, 
      pageSize = 10 
    } = params;

    const offset = (currentPage - 1) * pageSize;

    // Hotel 表的过滤条件
    const hotelWhere: any = { status: 'approved' }; // 仅展示审核通过的

    if (location) {
      hotelWhere[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { address: { [Op.like]: `%${location}%` } },
        { name_zh: { [Op.like]: `%${location}%` } }
      ];
    }

    if (rate) {
      hotelWhere.star_rating = rate;
    }

    // Room 表的过滤条件（价格筛选）
    const roomWhere: any = { is_active: true };
    if (price) {
      // 假设价格筛选是指“存在价格小于等于该值的房型”
      roomWhere.current_price = { [Op.lte]: price };
    }

    // 执行查询
    const { count, rows } = await Hotel.findAndCountAll({
      where: hotelWhere,
      limit: pageSize,
      offset: offset,
      distinct: true, // 防止 include 导致 count 计算错误
      include: [
        {
          model: HotelImage,
          as: 'images',
          where: { is_primary: true },
          required: false,
          attributes: ['image_url']
        },
        {
          model: Room,
          as: 'roomTypes',
          where: roomWhere,
          required: price ? true : false, // 如果传了价格筛选，必须匹配有该价格房型的酒店
          attributes: ['current_price']
        }
      ],
      order: [['star_rating', 'DESC']] // 默认按星级降序
    });

    // 计算最低价并转换字段名
    const list = rows.map(hotel => {
      const h = hotel.toJSON();
      
      // 计算该酒店所有房型中的最低价
      const minPrice = h.roomTypes && h.roomTypes.length > 0
        ? Math.min(...h.roomTypes.map((r: any) => parseFloat(r.current_price)))
        : 0;

      return {
        id: h.id,
        name: h.name_zh,
        rate: h.star_rating,
        score: 4.5, 
        address: h.address,
        facilities: Array.isArray(h.facilities) ? h.facilities : [], // 设施标签
        price: minPrice,
        imgUrl: h.images?.[0]?.image_url || ""
      };
    });

    return {
      list,
      total: count,
      currentPage: Number(currentPage),
      hasMore: offset + list.length < count
    };

  }

    /**
   * 用户端：获取酒店基础详情信息
   */
  static async getHotelInfoForUser(hotelId: number) {
    // 查询酒店及其关联的图片和房型
    const hotel = await Hotel.findOne({
      where: { 
        id: hotelId,
        status: 'approved' // 仅展示已审核通过的
      },
      include: [
        {
          model: HotelImage,
          as: 'images',
          attributes: ['image_url']
        },
        {
          model: Room,
          as: 'roomTypes',
          attributes: ['current_price']
        }
      ]
    });

    if (!hotel) {
      throw new AppError('未找到相关酒店或酒店已下架', 404);
    }

    const h = hotel.toJSON();

    // 计算最低价
    const minPrice = h.roomTypes && h.roomTypes.length > 0
      ? Math.min(...h.roomTypes.map((r: any) => parseFloat(r.current_price)))
      : 0;

    // 设施格式化：将原始 JSON 映射为带图标的对象数组
    // 原始数据是 ["免费WIFI", "停车场"]，映射逻辑：
    const iconMap: { [key: string]: string } = {
      "免费WIFI": "wifi",
      "停车场": "parking",
      "餐厅": "restaurant"
    };

    const formattedFacilities = (Array.isArray(h.facilities) ? h.facilities : []).map((item: string) => ({
      title: item,
      iconKey: iconMap[item] || 'default'
    }));

    // 数据映射返回
    return {
      id: h.id,
      name: h.name_zh,
      imgList: h.images?.map((img: any) => img.image_url) || [],
      score: h.average_rating || 4.5,
      rate: h.star_rating,
      address: h.address,
      price: minPrice,
      facilities: formattedFacilities
    };
  }

  /**
   * 用户端：获取酒店房型列表
   */
  static async getRoomListForUser(hotelId: number) {
    // 查询该酒店下所有激活的房型
    const rooms = await Room.findAll({
      where: { 
        hotel_id: hotelId,
        is_active: true 
      },
      order: [['current_price', 'ASC']] // 房型按价格从低到高排序
    });

    // 数据转换
    return rooms.map(room => {
      const r = room.toJSON();

      return {
        id: r.id,
        name: r.name,
        imageUrl: r.image_url || "",

        bedInfo: {
          number: r.bed_count,
          size: parseFloat(r.bed_size.toString())
        },
        area: parseInt(r.room_size) || 0,
        occupancy: parseInt(r.capacity) || 2,
        // 楼层、
        floor: r.floor?.match(/\d+/g)?.map(Number) || [1, 1],
        canCancel: true,
        instantConfirm: true,
        stock: r.total_stock,
        price: parseFloat(r.current_price)
      };
    });
  }


}