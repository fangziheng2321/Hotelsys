// src/services/home.service.ts
// 从数据库中筛选出已审核通过且标记为推荐的酒店，并提取它们的主图作为轮播图
import { Hotel, HotelImage } from '../models';

export class HomeService {
  /**
   * 获取首页轮播图列表
   * 拉取前 5 个标记为推荐(is_featured)且已发布的酒店
   */
  static async getHomeBanners() {
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

    // 数据映射：严格对齐 API_DOCUMENTATION.md 中的 BannerType 结构
    return featuredHotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name_zh,
      imgUrl: hotel.images?.[0]?.image_url || 'https://example.com/default-banner.jpg'
    }));
  }
}