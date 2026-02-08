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
    status: 'offline',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
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

  // 获取商户的酒店列表
  getMerchantHotels: (merchantId: string) => {
    return {
      success: true,
      data: mockHotels.filter(hotel => hotel.merchantId === merchantId)
    };
  },

  // 获取所有酒店（管理员用）
  getAllHotels: () => {
    return {
      success: true,
      data: mockHotels
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
  saveHotel: (hotel: Partial<Hotel>, forcePending: boolean = false) => {
    if (hotel.id) {
      // 更新酒店
      const index = mockHotels.findIndex(h => h.id === hotel.id);
      if (index !== -1) {
        mockHotels[index] = {
          ...mockHotels[index],
          ...hotel,
          // 如果forcePending为true，将状态改为审核中
          status: forcePending ? 'pending' : (hotel.status || mockHotels[index].status),
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
  }
};