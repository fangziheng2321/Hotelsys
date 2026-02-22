// src/services/home.service.ts
// 从数据库中筛选出已审核通过且标记为推荐的酒店，并提取它们的主图作为轮播图
import { Hotel, HotelImage } from '../models';
import redis from '../config/redis';

export class HomeService {
  // 缓存配置
  private static readonly CACHE_KEY = 'home:banners';
  private static readonly TTL = 1; 

  /**
   * 获取首页轮播图列表
   * 拉取前 5 个已发布的酒店
   */
  static async getHomeBanners() {

    const cachedBanners = await redis.get(this.CACHE_KEY);
    if (cachedBanners) {
      return JSON.parse(cachedBanners);
    }

    const featuredHotels = await Hotel.findAll({
      where: {
        is_featured: true,
        status: 'approved'
      },
      limit: 5,
      include: [
        {
          model: HotelImage,
          as: 'images',
          where: { is_primary: true },
          required: false,
          attributes: ['image_url']
        }
      ],
      attributes: ['id', 'name_zh']
    });

    // BannerType 结构
    const banners = featuredHotels.map(hotel => {
      const h = hotel.toJSON(); 
      return {
        id: h.id,
        name: h.name_zh,
        imgUrl: (h.images && h.images.length > 0) 
          ? h.images[0].image_url 
          : 'https://example.com/default-banner.jpg'
      };
    });

    // 4. 将结果存入 Redis 缓存
    if (banners.length > 0) {
      await redis.setex(this.CACHE_KEY, this.TTL, JSON.stringify(banners));
    }

    return banners;
  }
  /**
   * 手动清理首页缓存,在修改酒店状态或推荐状态时调用
   */
  static async clearHomeCache() {
    await redis.del(this.CACHE_KEY);
  }
  
}