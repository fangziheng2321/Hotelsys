// 模拟用户数据
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'merchant' | 'admin';
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'merchant1',
    password: '123456',
    role: 'merchant'
  },
  {
    id: '2',
    username: 'admin1',
    password: '123456',
    role: 'admin'
  }
];

// 酒店类型
export type HotelType = 'domestic' | 'overseas' | 'homestay' | 'hourly';

// 房型类型
export interface RoomType {
  id: string;
  name: string;           // 房型名称
  bedType: number;        // 床的规格
  bedCount: number;       // 床的数量
  roomSize: number;       // 房间大小
  capacity: number;       // 几人住
  minFloor: number;          // 最低楼层
  maxFloor: number;          // 最高楼层
  image: string;          // 房型图片
  roomCount: number;      // 房间数量
  price: number;          // 房型价格（元/晚）
}

// 模拟酒店数据
export interface Hotel {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  priceRange: string;
  starRating: number;
  amenities: string[];
  hotelType: HotelType;
  images: string[]; // 酒店图片URL数组
  roomTypes: RoomType[]; // 房型信息
  status: 'pending' | 'approved' | 'rejected' | 'offline';
  rejectReason?: string;
  merchantId: string;
  merchantName: string;
  createdAt: string;
  updatedAt: string;
}

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: '北京万豪酒店',
    address: '北京市朝阳区建国路83号',
    phone: '010-12345678',
    description: '北京万豪酒店位于朝阳区核心商圈，交通便利，设施齐全，是商务出行和休闲度假的理想选择。',
    priceRange: '¥800-2000',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室'],
    hotelType: 'domestic',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800'
    ],
    roomTypes: [
      {
        id: 'r1',
        name: '豪华大床房',
        bedType: '1.8米大床',
        roomSize: '35㎡',
        capacity: '2人',
        floor: '5-10层',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        roomCount: 20,
        price: 888
      },
      {
        id: 'r2',
        name: '商务双床房',
        bedType: '1.2米双床',
        roomSize: '40㎡',
        capacity: '2人',
        floor: '8-15层',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
        roomCount: 15,
        price: 688
      },
      {
        id: 'r3',
        name: '行政套房',
        bedType: '2.0米大床',
        roomSize: '65㎡',
        capacity: '2人',
        floor: '16-20层',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        roomCount: 5,
        price: 1588
      }
    ],
    status: 'approved',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '上海希尔顿酒店',
    address: '上海市浦东新区世纪大道8号',
    phone: '021-87654321',
    description: '上海希尔顿酒店坐落在浦东新区，俯瞰黄浦江美景，拥有豪华客房和套房，提供一流的服务和设施。',
    priceRange: '¥900-2500',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室', 'SPA'],
    hotelType: 'domestic',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
    ],
    roomTypes: [
      {
        id: 'r4',
        name: '江景大床房',
        bedType: '1.8米大床',
        roomSize: '38㎡',
        capacity: '2人',
        floor: '10-20层',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400',
        roomCount: 10,
        price: 788
      }
    ],
    status: 'pending',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '广州四季酒店',
    address: '广州市天河区珠江新城珠江西路5号',
    phone: '020-12345678',
    description: '广州四季酒店位于珠江新城核心区，拥有现代化的客房和套房，提供全方位的服务和设施。',
    priceRange: '¥700-1800',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室'],
    hotelType: 'overseas',
    images: [],
    roomTypes: [],
    status: 'rejected',
    rejectReason: '缺少营业执照副本',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: '深圳香格里拉酒店',
    address: '深圳市南山区深南大道9028号',
    phone: '0755-87654321',
    description: '深圳香格里拉酒店位于南山区，交通便利，拥有舒适的客房和完善的设施，是商务和休闲的理想选择。',
    priceRange: '¥600-1500',
    starRating: 4,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '会议室'],
    hotelType: 'homestay',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    ],
    roomTypes: [
      {
        id: 'r5',
        name: '标准间',
        bedType: '1.5米大床',
        roomSize: '25㎡',
        capacity: '2人',
        floor: '2-8层',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        roomCount: 8,
        price: 388
      },
      {
        id: 'r6',
        name: '家庭房',
        bedType: '1.8米+1.2米床',
        roomSize: '45㎡',
        capacity: '4人',
        floor: '3-6层',
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
        roomCount: 4,
        price: 588
      }
    ],
    status: 'offline',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: '成都快捷酒店',
    address: '成都市锦江区春熙路100号',
    phone: '028-12345678',
    description: '成都快捷酒店位于春熙路商圈，提供钟点房服务，方便快捷，价格实惠。',
    priceRange: '¥50-200',
    starRating: 2,
    amenities: ['免费WiFi', '空调', '热水'],
    hotelType: 'hourly',
    images: [],
    roomTypes: [],
    status: 'approved',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// 模拟API响应
export const mockApi = {
  // 用户登录
  login: (username: string, password: string) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      return {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      };
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  },

  // 用户注册
  register: (username: string, password: string, role: 'merchant' | 'admin') => {
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return {
        success: false,
        message: '用户名已存在'
      };
    } else {
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        username,
        password,
        role
      };
      mockUsers.push(newUser);
      return {
        success: true,
        data: {
          token: 'mock-token',
          user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
          }
        }
      };
    }
  },

  // 获取商户的酒店列表 - 只返回基础信息
  getMerchantHotels: (merchantId: string) => {
    const list = mockHotels
      .filter(hotel => hotel.merchantId === merchantId)
      .map(hotel => ({
        id: hotel.id,
        name: hotel.name,
        address: hotel.address,
        phone: hotel.phone,
        hotelType: hotel.hotelType,
        status: hotel.status,
        firstImage: hotel.images && hotel.images.length > 0 ? hotel.images[0] : ''
      }));
    return {
      success: true,
      data: list
    };
  },

  // 获取所有酒店列表（管理员用）- 只返回基础信息
  getAllHotels: () => {
    const list = mockHotels.map(hotel => ({
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      phone: hotel.phone,
      merchantName: hotel.merchantName,
      status: hotel.status,
      rejectReason: hotel.rejectReason,
      firstImage: hotel.images && hotel.images.length > 0 ? hotel.images[0] : ''
    }));
    return {
      success: true,
      data: list
    };
  },

  // 获取单个酒店详情
  getHotelById: (id: string) => {
    const hotel = mockHotels.find(h => h.id === id);
    if (hotel) {
      return {
        success: true,
        data: hotel
      };
    } else {
      return {
        success: false,
        message: '酒店不存在'
      };
    }
  },

  // 创建或更新酒店
  // forcePending: 是否强制将状态设为审核中（用于编辑已发布/已拒绝/已下线的酒店）
  saveHotel: (hotel: Partial<Hotel>) => {
    if (hotel.id) {
      // 更新酒店
      const index = mockHotels.findIndex(h => h.id === hotel.id);
      if (index !== -1) {
        mockHotels[index] = {
          ...mockHotels[index],
          ...hotel,
          // 如果forcePending为true，将状态改为审核中
          status: 'pending',
          updatedAt: new Date().toISOString()
        };
        return {
          success: true,
          data: mockHotels[index]
        };
      } else {
        return {
          success: false,
          message: '酒店不存在'
        };
      }
    } else {
      // 创建酒店
      const newHotel: Hotel = {
        id: (mockHotels.length + 1).toString(),
        name: hotel.name || '',
        address: hotel.address || '',
        phone: hotel.phone || '',
        description: hotel.description || '',
        priceRange: hotel.priceRange || '',
        starRating: hotel.starRating || 1,
        amenities: hotel.amenities || [],
        hotelType: hotel.hotelType || 'domestic',
        images: hotel.images || [],
        roomTypes: hotel.roomTypes || [],
        status: 'pending',
        merchantId: hotel.merchantId || '1',
        merchantName: hotel.merchantName || '商户1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockHotels.push(newHotel);
      return {
        success: true,
        data: newHotel
      };
    }
  },

  // 审核酒店
  auditHotel: (id: string, status: 'approved' | 'rejected', rejectReason?: string) => {
    const index = mockHotels.findIndex(h => h.id === id);
    if (index !== -1) {
      mockHotels[index] = {
        ...mockHotels[index],
        status,
        rejectReason,
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: mockHotels[index]
      };
    } else {
      return {
        success: false,
        message: '酒店不存在'
      };
    }
  },

  // 上下线酒店
  toggleHotelStatus: (id: string, status: 'approved' | 'offline') => {
    const index = mockHotels.findIndex(h => h.id === id);
    if (index !== -1) {
      mockHotels[index] = {
        ...mockHotels[index],
        status,
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: mockHotels[index]
      };
    } else {
      return {
        success: false,
        message: '酒店不存在'
      };
    }
  },

  // 更新房型房间数量（已发布酒店，不需要审核）
  updateRoomCount: (id: string, roomTypes: RoomType[]) => {
    const index = mockHotels.findIndex(h => h.id === id);
    if (index !== -1) {
      // 只有已发布的酒店才能直接更新房间数量
      if (mockHotels[index].status !== 'approved') {
        return {
          success: false,
          message: '只有已发布的酒店才能编辑房间数量'
        };
      }

      mockHotels[index] = {
        ...mockHotels[index],
        roomTypes,
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        data: mockHotels[index]
      };
    } else {
      return {
        success: false,
        message: '酒店不存在'
      };
    }
  }
};