import { Hotel, HotelImage, Room, sequelize, User } from '../models';
import { AppError } from '../utils/AppError';
import { Op, WhereOptions } from 'sequelize';

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
      city,       
      district,   
      phone, 
      description, 
      opening_time,
      starRating, 
      amenities, 
      hotelType, 
      isFeatured,
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
            city,             
            district,         
            contact_phone: phone,
            description,
            opening_time,
            star_rating: starRating,
            facilities: amenities, 
            hotel_type: hotelType || 'domestic',
            is_featured: isFeatured || true, 
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
          bed_count: Number(room.bedCount || room.bed_count || 1),
          bed_size: Number(room.bedSize || room.bed_size || 1.80),          
          room_size: room.roomSize || room.room_size,   
          capacity: room.capacity,    
          floor: room.floor,          
          image_url: room.image || room.image_url,      
          total_stock: Number(room.roomCount || room.total_stock || 10),
          current_price: Number(room.price || room.current_price || 0),
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
        { model: HotelImage, as: 'images', attributes: ['image_url'] },
        { model: Room, as: 'roomTypes' }
      ]
    });

    if (!hotel) {
      throw new AppError('未找到该酒店或无权访问', 404);
    }

    const h = hotel.toJSON();

    // 数据映射
    return {
      id: h.id,
      name: h.name_zh,
      address: h.address,
      city: h.city,
      district: h.district,
      phone: h.contact_phone,
      description: h.description,
      opening_time:h.opening_time,
      starRating: h.star_rating,
      amenities: h.facilities,
      hotelType: h.hotel_type,
      isFeatured: h.is_featured,
      images: h.images?.map((img: any) => img.image_url) || [],
      roomTypes: h.roomTypes?.map((room: any) => ({
        id: room.id,
        name: room.name,
        bedCount: room.bed_count,
        bedSize: room.bed_size,
        roomSize: room.room_size,
        capacity: room.capacity,
        floor: room.floor,
        image: room.image_url,
        roomCount: room.total_stock,
        price: room.current_price
      })) || h.roomTypes?.map((room: any) => ({ 
        id: room.id,
        name: room.name,
        bedCount: room.bed_count,
        bedSize: room.bed_size,
        roomSize: room.room_size,
        capacity: room.capacity,
        floor: room.floor,
        image: room.image_url,
        roomCount: room.total_stock,
        price: room.current_price
      }))
    };
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
  static async searchHotels(payload: any) {
    const { 
      currentPage = 1, 
      pageSize = 10, 
      location,     
      rate,         
      priceRange,   
      facilities,   
      distance,     
      latitude,     
      longitude,    
      type,         
      hotelName     
    } = payload;


    const whereClause: any = {
      status: 'approved' // 只查审核通过的
    };

    // 非 null 校验
    if (location) {
      whereClause[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { district: { [Op.like]: `%${location}%` } },
        { address: { [Op.like]: `%${location}%` } }
      ];
    }

    if (hotelName) {
      whereClause.name_zh = { [Op.like]: `%${hotelName}%` };
    }

    if (type) {
      whereClause.hotel_type = type;
    }

    if (rate !== undefined && rate !== null) {
      whereClause.star_rating = rate;
    }

    // 设施筛选
    if (Array.isArray(facilities) && facilities.length > 0) {
      whereClause[Op.and] = whereClause[Op.and] || [];
      facilities.forEach((f: string) => {
        whereClause[Op.and].push(
          sequelize.where(
            sequelize.fn('JSON_CONTAINS', sequelize.col('facilities'), JSON.stringify(f)),
            1
          )
        );
      });
    }

    // 距离筛选
    if (Array.isArray(distance) && distance.length === 2 && latitude && longitude) {
      const [dMin, dMax] = distance;
      const distanceSql = sequelize.literal(
        `(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude))))`
      );
      whereClause[Op.and] = whereClause[Op.and] || [];
      if (dMin !== null) whereClause[Op.and].push(sequelize.where(distanceSql, { [Op.gte]: dMin }));
      if (dMax !== null) whereClause[Op.and].push(sequelize.where(distanceSql, { [Op.lte]: dMax }));
    }

    // 价格区间
    const roomWhere: any = {};
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      const [pMin, pMax] = priceRange;
      if (pMin !== null || pMax !== null) {
        roomWhere.current_price = {};
        if (pMin !== null) roomWhere.current_price[Op.gte] = pMin;
        if (pMax !== null) roomWhere.current_price[Op.lte] = pMax;
      }
    }

    // 查询
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      distinct: true,
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      include: [
        {
          model: HotelImage,
          as: 'images',
          where: { is_primary: true },
          required: false
        },
        {
          model: Room,
          as: 'roomTypes',
          where: Object.keys(roomWhere).length > 0 ? roomWhere : undefined,
          required: Object.keys(roomWhere).length > 0 // 有价格筛选则必须匹配房型
        }
      ],
      order: [['id', 'DESC']]
    });

    return {
      list: rows.map(hotel => this.formatHotelForList(hotel)),
      total: count,
      currentPage: Number(currentPage),
      hasMore: count > currentPage * pageSize 
    };
  }

  private static formatHotelForList(hotel: any) {
    const h = hotel.get({ plain: true });
    
    // 计算最低价
    const prices = h.roomTypes?.map((r: any) => parseFloat(r.current_price)) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      id: h.id,
      name: h.name_zh,
      rate: h.star_rating,      
      address: h.address,       
      facilities: typeof h.facilities === 'string' ? JSON.parse(h.facilities) : (h.facilities || []),
      price: minPrice,
      imgUrl: h.images?.[0]?.image_url || ''
    };
  }

    /**
   * 用户端：获取酒店基础详情信息
   */
  static async getHotelInfoForUser(hotelId: number) {
    const hotel = await Hotel.findOne({
      where: { 
        id: hotelId,
        status: 'approved' 
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

    const facilitiesArray = Array.isArray(h.facilities) ? h.facilities : [];

    // 数据映射
    return {
      id: h.id,
      name: h.name_zh,
      imgList: h.images?.map((img: any) => img.image_url) || [],
      rate: h.star_rating,
      address: h.address,
      price: minPrice,
      description: h.description || "", 
      contactPhone: h.contact_phone || "",
      facilities: facilitiesArray
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
        floor: r.floor?.match(/\d+/g)?.map(Number) || [1, 1],
        canCancel: true,
        instantConfirm: true,
        stock: r.total_stock,
        price: parseFloat(r.current_price)
      };
    });
  }


}