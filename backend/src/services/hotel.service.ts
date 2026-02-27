import { Hotel, HotelImage, Room, sequelize, User } from '../models';
import { AppError } from '../utils/AppError';
import { Op, WhereOptions } from 'sequelize';
import redis from '../config/redis';
import { HomeService } from './home.service';

export class HotelService {
  // 定义缓存键名前缀
  private static readonly CACHE_KEYS = {
    DETAIL: (id: string | number) => `hotel:detail:${id}`,
    DETAIL_USER: (id: string | number) => `hotel:detail:user:${id}`,
    ROOMS_USER: (id: string | number) => `hotel:rooms:user:${id}`,
    LIST_MERCHANT: (id: number) => `hotel:list:merchant:${id}`,
    LIST_ADMIN: "hotel:list:admin",
    VIZ_MERCHANT: (id: number) => `hotel:viz:merchant:${id}`,
    VIZ_ADMIN: "hotel:viz:admin",
    SEARCH: "hotel:search",
  };

  // 设置统一的过期时间（10分钟）
  private static readonly TTL = 600;

  /**
   * 清理相关缓存
   * 只要数据发生变动（增删改），就必须清理受影响的缓存
   */
  private static async clearHotelCaches(
    hotelId?: number | string,
    merchantId?: number,
  ) {
    const keysToDel: string[] = [
      this.CACHE_KEYS.VIZ_ADMIN,
      this.CACHE_KEYS.LIST_ADMIN,
    ];

    if (hotelId) {
      keysToDel.push(this.CACHE_KEYS.DETAIL(hotelId));
      keysToDel.push(this.CACHE_KEYS.DETAIL_USER(hotelId));
      keysToDel.push(this.CACHE_KEYS.ROOMS_USER(hotelId));
    }

    if (merchantId) {
      keysToDel.push(this.CACHE_KEYS.VIZ_MERCHANT(merchantId));
      keysToDel.push(this.CACHE_KEYS.LIST_MERCHANT(merchantId));
    }

    // 批量删除
    if (keysToDel.length > 0) {
      await redis.del(...keysToDel);
    }

    await HomeService.clearHomeCache();
  }

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
      city,
      opening_time,
      starRating,
      amenities,
      hotelType,
      region,
      images,
      roomTypes,
    } = payload;

    return await sequelize.transaction(async (t) => {
      let hotel;

      // 属性映射
      const hotelData: any = {
        name_zh: name,
        address,
        city: city,
        region: region,
        contact_phone: phone,
        description,
        opening_time,
        star_rating: starRating,
        facilities: amenities,
        hotel_type: hotelType || "domestic",
        merchant_id: merchantId,
        status: "pending",
        rejection_reason: null,
      };

      if (id) {
        hotel = await Hotel.findOne({
          where: { id, merchant_id: merchantId },
          transaction: t,
        });
        if (!hotel) throw new AppError("酒店不存在或无权操作", 404);
        await hotel.update(hotelData, { transaction: t });
      } else {
        hotel = await Hotel.create(hotelData, { transaction: t });
      }

      // 3. 房型更新
      if (roomTypes && Array.isArray(roomTypes)) {
        // 获取数据库中现有的房型 ID
        const currentRooms = await Room.findAll({
          where: { hotel_id: hotel.id },
          attributes: ["id"],
          transaction: t,
        });
        const currentRoomIds = currentRooms.map((r) => r.id);

        // 筛选需要被软删除的 ID
        const incomingRoomIds = roomTypes
          .filter((r: any) => r.id)
          .map((r: any) => Number(r.id));
        const idsToDelete = currentRoomIds.filter(
          (cid) => !incomingRoomIds.includes(cid),
        );

        if (idsToDelete.length > 0) {
          // 执行软删除
          await Room.destroy({ where: { id: idsToDelete }, transaction: t });
        }

        // 循环执行 Upsert
        for (const room of roomTypes) {
          const roomPayload = {
            hotel_id: hotel.id,
            name: room.name,
            bed_count: Number(room.bedCount || 1),
            bed_size: Number(room.bedType || 1.8),
            room_size: String(room.roomSize),
            capacity: String(room.capacity),
            floor: `${room.minFloor || 1}-${room.maxFloor || 1}`,
            image_url: room.image,
            total_stock: Number(room.roomCount || 0),
            current_price: Number(room.price || 0),
            is_active: true,
          };

          if (room.id && currentRoomIds.includes(Number(room.id))) {
            // 更新房型
            await Room.update(roomPayload, {
              where: { id: room.id, hotel_id: hotel.id },
              transaction: t,
            });
          } else {
            // 创建新房型
            await Room.create(roomPayload, { transaction: t });
          }
        }
      }

      // 4. 图片更新
      if (images && Array.isArray(images)) {
        const currentImages = await HotelImage.findAll({
          where: { hotel_id: hotel.id },
          attributes: ["id", "image_url"],
          transaction: t,
        });

        const currentImageIds = currentImages.map((img) => img.id);
        await HotelImage.destroy({
          where: { hotel_id: hotel.id },
          transaction: t,
        });

        const imageData = images.map((url: string, index: number) => ({
          hotel_id: hotel.id,
          image_url: url,
          is_primary: index === 0,
          uploaded_by: merchantId,
        }));
        await HotelImage.bulkCreate(imageData, { transaction: t });
      }

      await this.clearHotelCaches(hotel.id, merchantId);

      return true;
    });
  }

  /**
   * 获取商户自己的酒店列表
   * GET /api/merchant/hotels?page=1&pageSize=10
   */
  static async getMerchantHotels(
    merchantId: number,
    query: {
      page?: number;
      pageSize?: number;
      hotelType?: string;
      status?: string;
      search?: string;
    },
  ) {
    // 分页参数
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Number(query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    // 构建动态 WHERE 条件
    const whereClause: any = { merchant_id: merchantId };

    //酒店关键词搜索
    if (query.search) {
      whereClause.name_zh = {
        [Op.like]: `%${query.search}%`,
      };
    }

    // 酒店类型筛选
    if (query.hotelType) {
      whereClause.hotel_type = query.hotelType;
    }

    // 状态筛选
    if (query.status) {
      whereClause.status = query.status;
    }

    // 查询
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: HotelImage,
          as: "images",
          where: { is_primary: true },
          required: false,
          attributes: ["image_url"],
        },
      ],
      order: [["id", "ASC"]],
    });

    // 数据映射
    const list = rows.map((hotel) => {
      const h = hotel.toJSON();
      return {
        id: h.id.toString(),
        name: h.name_zh,
        address: h.address,
        phone: h.contact_phone,
        hotelType: h.hotel_type,
        status: h.status,
        rejectReason: h.rejection_reason || null,
        firstImage: h.images?.[0]?.image_url || "",
      };
    });

    return {
      list,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 获取酒店完整详情
   * 使用merchantId 校验，确保商户只能看到自己的酒店详情
   */
  static async getHotelDetail(id: number, merchantId: number) {
    const cacheKey = this.CACHE_KEYS.DETAIL(id);
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const hotel = await Hotel.findOne({
      where: { id, merchant_id: merchantId },
      include: [
        { model: HotelImage, as: "images" },
        { model: Room, as: "roomTypes" },
      ],
    });

    if (!hotel) throw new AppError("未找到酒店", 404);

    const h = hotel.toJSON();
    const prices =
      h.roomTypes?.map((r: any) => parseFloat(r.current_price)) || [];

    const result = {
      id: h.id.toString(),
      name: h.name_zh,
      address: h.address,
      phone: h.contact_phone,
      description: h.description || "",
      opening_time: h.opening_time,
      minPrice: prices.length > 0 ? Math.min(...prices) : 0,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      starRating: h.star_rating,
      amenities: h.facilities || [],
      hotelType: h.hotel_type,
      city: h.city,
      region: h.region,
      latitude: h.latitude,
      longitude: h.longitude,
      images: h.images?.map((img: any) => img.image_url) || [],
      roomTypes:
        h.roomTypes?.map((room: any) => ({
          id: room.id.toString(),
          name: room.name,
          bedType: parseFloat(room.bed_size),
          bedCount: room.bed_count,
          roomSize: parseInt(room.room_size) || 0,
          capacity: parseInt(room.capacity) || 2,
          minFloor: room.floor?.split("-")[0] || 1,
          maxFloor: room.floor?.split("-")[1] || 1,
          image: room.image_url || "",
          roomCount: room.total_stock,
          price: parseFloat(room.current_price),
        })) || [],
    };

    await redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    return result;
  }

  /**
   * 更新房间库存
   * 校验酒店归属权 -> 校验房型归属权 -> 仅更新库存
   */
  static async updateRoomStock(
    hotelId: number,
    merchantId: number,
    roomTypes: any[],
  ) {
    // 查找酒店并校验归属权及状态
    const hotel = await Hotel.findOne({
      where: { id: hotelId, merchant_id: merchantId },
    });

    if (!hotel) {
      throw new AppError("未找到相关酒店信息，无权操作", 403);
    }

    // 只有已发布的酒店才能直接改库存
    if (hotel.status !== "approved") {
      throw new AppError(
        "只有已发布(approved)状态的酒店才能直接修改房间数量",
        400,
      );
    }

    // 开启事务进行批量更新
    const result = await sequelize.transaction(async (t) => {
      for (const roomItem of roomTypes) {
        const { id: roomId, roomCount } = roomItem;
        const room = await Room.findOne({
          where: { id: roomId, hotel_id: hotelId },
          transaction: t,
        });
        if (room) {
          await room.update(
            { total_stock: Number(roomCount) },
            { transaction: t },
          );
        }
      }
      return true;
    });

    // 更新库存后清理缓存
    await this.clearHotelCaches(hotelId, merchantId);
    return result;
  }

  /**
   * 管理员获取全局酒店列表
   * /admin/hotels?page=1&pageSize=10
   */
  static async getAdminHotels(query: {
    page?: number;
    pageSize?: number;
    hotelType?: string;
    status?: string;
    search?: string;
  }) {
    // 分页参数
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Number(query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const whereClause: any = {};

    if (query.search) {
      whereClause.name_zh = {
        [Op.like]: `%${query.search}%`,
      };
    }

    // hotelType筛选条件
    if (query.hotelType) {
      whereClause.hotel_type = query.hotelType;
    }

    // status筛选条件
    if (query.status) {
      whereClause.status = query.status;
    }

    // 查询
    const { count, rows } = await Hotel.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: offset,
      include: [
        {
          model: User,
          as: "merchant",
          attributes: ["username"],
        },
        {
          model: HotelImage,
          as: "images",
          where: { is_primary: true },
          required: false,
          attributes: ["image_url"],
        },
      ],
      order: [["id", "ASC"]],
    });

    // 数据映射
    const list = rows.map((hotel) => {
      const h = hotel.toJSON();
      return {
        id: h.id.toString(),
        name: h.name_zh,
        address: h.address,
        phone: h.contact_phone,
        merchantName: h.merchant?.username || "未知商户",
        status: h.status,
        hotelType: h.hotel_type,
        rejectReason: h.rejection_reason || null,
        firstImage: h.images?.[0]?.image_url || "",
      };
    });

    return {
      list,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    };
  }

  /**
   * 管理员获取酒店完整详情
   */
  static async getAdminHotelDetail(id: number) {
    // 查询酒店，关联商户、图片和房型
    const hotel = await Hotel.findByPk(id, {
      include: [
        { model: User, as: "merchant", attributes: ["id", "username"] },
        { model: HotelImage, as: "images", attributes: ["image_url"] },
        { model: Room, as: "roomTypes" },
      ],
    });

    if (!hotel) {
      throw new AppError("酒店不存在", 404);
    }

    const h = hotel.toJSON();

    // 计算价格区间
    const prices =
      h.roomTypes?.map((r: any) => parseFloat(r.current_price)) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // 数据映射
    return {
      id: h.id.toString(),
      name: h.name_zh, // name_zh -> name
      address: h.address,
      phone: h.contact_phone, // contact_phone -> phone
      description: h.description || "",
      opening_time: h.opening_time,
      minPrice: minPrice,
      maxPrice: maxPrice,
      starRating: h.star_rating, // star_rating -> starRating
      amenities: h.facilities || [], // facilities -> amenities
      hotelType: h.hotel_type,
      city: h.city,
      region: h.region,
      latitude: h.latitude,
      longitude: h.longitude,
      images: h.images?.map((img: any) => img.image_url) || [],

      roomTypes:
        h.roomTypes?.map((room: any) => {
          const floors = room.floor?.match(/\d+/g)?.map(Number) || [1, 1];
          return {
            id: room.id.toString(),
            name: room.name,
            bedType: parseFloat(room.bed_size),
            bedCount: room.bed_count,
            roomSize: parseInt(room.room_size) || 0,
            capacity: parseInt(room.capacity) || 2,
            minFloor: floors[0],
            maxFloor: floors[1] || floors[0],
            image: room.image_url || "",
            roomCount: room.total_stock,
            price: parseFloat(room.current_price),
          };
        }) || [],

      status: h.status,
      merchantId: h.merchant_id.toString(),
      merchantName: h.merchant?.username || "未知商户",
      createdAt: h.created_at,
      updatedAt: h.updated_at,
    };
  }

  /**
   * 审核酒店逻辑
   */
  static async auditHotel(params: {
    hotelId: number;
    adminId: number;
    status: "approved" | "rejected";
    rejectReason?: string;
  }) {
    const { hotelId, adminId, status, rejectReason } = params;

    return await sequelize.transaction(async (t) => {
      // 查找酒店并锁定行（防止并发审核）
      const hotel = await Hotel.findByPk(hotelId, { transaction: t });
      if (!hotel) throw new AppError("酒店不存在", 404);

      // 只有 pending 状态能审核
      if (hotel.status !== "pending") {
        throw new AppError("只有待审核状态的酒店才能执行此操作", 400);
      }

      // 更新酒店状态
      await hotel.update(
        {
          status: status,
          rejection_reason: status === "rejected" ? rejectReason : null,
        },
        { transaction: t },
      );

      // 记录审计日志
      await (sequelize.models.AuditLog as any).create(
        {
          hotel_id: hotelId,
          admin_id: adminId,
          action: status === "approved" ? "approve" : "reject",
          reason: rejectReason || "审批通过",
        },
        { transaction: t },
      );

      // 清理缓存
      await this.clearHotelCaches(hotelId, hotel.merchant_id);
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
    targetStatus: "approved" | "offline";
  }) {
    const { hotelId, adminId, targetStatus } = params;

    return await sequelize.transaction(async (t) => {
      // 查找酒店
      const hotel = await Hotel.findByPk(hotelId, { transaction: t });
      if (!hotel) throw new AppError("酒店不存在", 404);

      // 状态校验：只有 approved 或 offline 状态能切换
      const allowedStatuses = ["approved", "offline"];
      if (!allowedStatuses.includes(hotel.status)) {
        throw new AppError("只有已发布或已下线的酒店才能执行此操作", 400);
      }

      // 更新状态
      await hotel.update(
        {
          status: targetStatus,
        },
        { transaction: t },
      );

      // 记录审计日志
      const actionMap = {
        offline: "offline",
        approved: "online",
      };

      await (sequelize.models.AuditLog as any).create(
        {
          hotel_id: hotelId,
          admin_id: adminId,
          action: actionMap[targetStatus],
          reason:
            targetStatus === "offline"
              ? "管理员执行强制下线"
              : "管理员恢复上线",
        },
        { transaction: t },
      );

      // 状态变更后清理缓存，防止用户搜到下架酒店
      await this.clearHotelCaches(hotelId, hotel.merchant_id);
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
      hotelName,
      sortOrder,
      sortBy,
    } = payload;

    const whereClause: any = {
      status: "approved", // 只查审核通过的
    };

    // 非 null 校验
    if (location) {
      whereClause[Op.or] = [{ city: { [Op.like]: `%${location}%` } }];
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
            sequelize.fn(
              "JSON_CONTAINS",
              sequelize.col("facilities"),
              JSON.stringify(f),
            ),
            1,
          ),
        );
      });
    }

    // 距离筛选
    if (
      Array.isArray(distance) &&
      distance.length === 2 &&
      latitude &&
      longitude
    ) {
      const [dMin, dMax] = distance;
      const distanceSql = sequelize.literal(
        `(6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude))))`,
      );
      whereClause[Op.and] = whereClause[Op.and] || [];
      if (dMin !== null)
        whereClause[Op.and].push(
          sequelize.where(distanceSql, { [Op.gte]: dMin }),
        );
      if (dMax !== null)
        whereClause[Op.and].push(
          sequelize.where(distanceSql, { [Op.lte]: dMax }),
        );
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

    // 默认排序
    let orderClause: any = [["id", "ASC"]];

    const direction =
      sortOrder && sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    // 字段映射处理
    if (sortBy) {
      switch (sortBy) {
        case "price":
          const minPriceSql = sequelize.literal(
            "(SELECT MIN(current_price) FROM rooms WHERE rooms.hotel_id = Hotel.id)",
          );
          orderClause = [[minPriceSql, direction]];
          break;
        case "rate":
          orderClause = [["star_rating", direction]];
          break;
        default:
          orderClause = [["id", "ASC"]];
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
          as: "images",
          where: { is_primary: true },
          required: false,
        },
        {
          model: Room,
          as: "roomTypes",
          where: Object.keys(roomWhere).length > 0 ? roomWhere : undefined,
          required: Object.keys(roomWhere).length > 0, // 有价格筛选则必须匹配房型
        },
      ],
      order: orderClause,
    });

    return {
      list: rows.map((hotel) => this.formatHotelForList(hotel)),
      total: count,
      currentPage: Number(currentPage),
      hasMore: count > currentPage * pageSize,
    };
  }

  private static formatHotelForList(hotel: any) {
    const h = hotel.get({ plain: true });

    // 计算最低价
    const prices =
      h.roomTypes?.map((r: any) => parseFloat(r.current_price)) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      id: h.id,
      name: h.name_zh,
      rate: h.star_rating,
      address: h.address,
      latitude: h.latitude,
      longitude: h.longitude,
      facilities:
        typeof h.facilities === "string"
          ? JSON.parse(h.facilities)
          : h.facilities || [],
      price: minPrice,
      imgUrl: h.images?.[0]?.image_url || "",
    };
  }

  /**
   * 用户端：获取酒店基础详情信息
   */
  static async getHotelInfoForUser(hotelId: number) {
    const cacheKey = this.CACHE_KEYS.DETAIL_USER(hotelId);

    // 优先读缓存
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const hotel = await Hotel.findOne({
      where: {
        id: hotelId,
        status: "approved",
      },
      include: [
        {
          model: HotelImage,
          as: "images",
          attributes: ["image_url"],
        },
        {
          model: Room,
          as: "roomTypes",
          attributes: ["current_price"],
        },
      ],
    });

    if (!hotel) {
      throw new AppError("未找到相关酒店或酒店已下架", 404);
    }

    const h = hotel.toJSON();

    // 计算最低价
    const minPrice =
      h.roomTypes && h.roomTypes.length > 0
        ? Math.min(...h.roomTypes.map((r: any) => parseFloat(r.current_price)))
        : 0;

    const facilitiesArray = Array.isArray(h.facilities) ? h.facilities : [];

    // 数据映射
    const result = {
      id: h.id,
      name: h.name_zh,
      imgList: h.images?.map((img: any) => img.image_url) || [],
      rate: h.star_rating,
      address: h.address,
      price: minPrice,
      latitude: h.latitude,
      longitude: h.longitude,
      description: h.description || "",
      contactPhone: h.contact_phone || "",
      facilities: facilitiesArray,
    };
    // 写入缓存
    await redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    return result;
  }

  /**
   * 用户端：获取酒店房型列表
   */
  static async getRoomListForUser(hotelId: number) {
    const cacheKey = this.CACHE_KEYS.ROOMS_USER(hotelId);

    // 性能优化：优先读缓存
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 查询该酒店下所有激活的房型
    const rooms = await Room.findAll({
      where: {
        hotel_id: hotelId,
        is_active: true,
      },
      order: [["current_price", "ASC"]], // 房型按价格从低到高排序
    });

    // 数据转换
    const result = rooms.map((room) => {
      const r = room.toJSON();

      return {
        id: r.id,
        name: r.name,
        imageUrl: r.image_url || "",

        bedInfo: {
          number: r.bed_count,
          size: parseFloat(r.bed_size.toString()),
        },
        area: parseInt(r.room_size) || 0,
        occupancy: parseInt(r.capacity) || 2,
        floor: r.floor?.match(/\d+/g)?.map(Number) || [1, 1],
        canCancel: true,
        instantConfirm: true,
        stock: r.total_stock,
        price: parseFloat(r.current_price),
      };
    });

    // 写入缓存
    await redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    return result;
  }

  /**
   * 商户获取酒店可视化数据,统计各城市分布及各状态比例
   */
  static async getMerchantVisualization(merchantId: number) {
    const cacheKey = this.CACHE_KEYS.VIZ_MERCHANT(merchantId);

    // 查缓存
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 查数据库
    const regionStats = await Hotel.findAll({
      where: { merchant_id: merchantId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
        [sequelize.col("region"), "name"],
      ],
      group: ["region"],
      raw: true,
    });

    const statusStats = await Hotel.findAll({
      where: { merchant_id: merchantId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
        [sequelize.col("status"), "statusEnum"],
      ],
      group: ["status"],
      raw: true,
    });

    const statusMap: { [key: string]: string } = {
      pending: "审核中",
      approved: "已发布",
      rejected: "已拒绝",
      offline: "已下线",
    };

    const result = {
      provinceData: regionStats.map((item: any) => ({
        name: item.name || "未知",
        value: parseInt(item.value),
      })),
      auditData: statusStats.map((item: any) => ({
        name: statusMap[item.statusEnum] || item.statusEnum,
        value: parseInt(item.value),
      })),
    };

    // 写入缓存
    await redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    return result;
  }

  /**
   * 管理员获取全局酒店可视化数据，统计全平台酒店的城市分布及各状态比例
   */
  static async getAdminVisualization() {
    const cacheKey = this.CACHE_KEYS.VIZ_ADMIN;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const regionStats = await Hotel.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
        [sequelize.col("region"), "name"],
      ],
      group: ["region"],
      raw: true,
    });

    const statusStats = await Hotel.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "value"],
        [sequelize.col("status"), "statusEnum"],
      ],
      group: ["status"],
      raw: true,
    });

    const statusMap: { [key: string]: string } = {
      pending: "审核中",
      approved: "已发布",
      rejected: "已拒绝",
      offline: "已下线",
    };

    const result = {
      provinceData: regionStats.map((item: any) => ({
        name: item.name || "未知",
        value: parseInt(item.value),
      })),
      auditData: statusStats.map((item: any) => ({
        name: statusMap[item.statusEnum] || item.statusEnum,
        value: parseInt(item.value),
      })),
    };

    await redis.setex(cacheKey, this.TTL, JSON.stringify(result));
    return result;
  }
}