import axios, { AxiosInstance, AxiosError } from 'axios';

// ==================== 类型定义 ====================

export type UserRole = 'merchant' | 'admin';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
}

export type HotelType = 'domestic' | 'overseas' | 'homestay' | 'hourly';
export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'offline';

export interface RoomType {
  id: string;
  name: string;
  bedType: string;
  roomSize: string;
  capacity: string;
  floor: string;
  image: string;
  roomCount: number;
  price: number;
}

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
  images: string[];
  roomTypes: RoomType[];
  status: HotelStatus;
  rejectReason?: string;
  merchantId: string;
  merchantName: string;
  createdAt: string;
  updatedAt: string;
}

// 商户端酒店列表项（精简字段）
export interface MerchantHotelListItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  hotelType: HotelType;
  status: HotelStatus;
  firstImage: string;
}

// 管理员端酒店列表项（精简字段）
export interface AdminHotelListItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  merchantName: string;
  status: HotelStatus;
  rejectReason?: string;
  firstImage: string;
}

// 通用响应类型
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

// ==================== Mock 数据 ====================

// 模拟用户数据
const mockUsers: User[] = [
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
const mockHotels: Hotel[] = [
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
  },
  {
    id: '6',
    name: '杭州西湖国宾馆',
    address: '杭州市西湖区杨公堤18号',
    phone: '0571-87979888',
    description: '杭州西湖国宾馆坐落于西湖核心景区，环境优美，是接待重要宾客的国宾馆。',
    priceRange: '¥1200-3500',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室'],
    hotelType: 'domestic',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
    ],
    roomTypes: [
      {
        id: 'r7',
        name: '湖景套房',
        bedType: '2.0米大床',
        roomSize: '80㎡',
        capacity: '2人',
        floor: '1-3层',
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
        roomCount: 6,
        price: 2588
      }
    ],
    status: 'approved',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: '南京金陵饭店',
    address: '南京市鼓楼区汉中路2号',
    phone: '025-84711888',
    description: '南京金陵饭店是南京地标性建筑，历史悠久，服务一流，是商务出行的首选。',
    priceRange: '¥800-2200',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '会议室'],
    hotelType: 'domestic',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    ],
    roomTypes: [
      {
        id: 'r8',
        name: '商务大床房',
        bedType: '1.8米大床',
        roomSize: '35㎡',
        capacity: '2人',
        floor: '10-25层',
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
        roomCount: 15,
        price: 888
      },
      {
        id: 'r9',
        name: '豪华套房',
        bedType: '2.0米大床',
        roomSize: '60㎡',
        capacity: '2人',
        floor: '26-30层',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
        roomCount: 5,
        price: 1888
      }
    ],
    status: 'pending',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: '西安曲江民宿',
    address: '西安市雁塔区曲江池西路',
    phone: '029-88886666',
    description: '西安曲江民宿位于大雁塔景区附近，古色古香的装修风格，体验地道的西安文化。',
    priceRange: '¥200-500',
    starRating: 3,
    amenities: ['免费WiFi', '停车场', '餐厅'],
    hotelType: 'homestay',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    roomTypes: [
      {
        id: 'r10',
        name: '古风大床房',
        bedType: '1.8米大床',
        roomSize: '30㎡',
        capacity: '2人',
        floor: '2层',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400',
        roomCount: 8,
        price: 288
      }
    ],
    status: 'approved',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: '三亚海棠湾度假酒店',
    address: '三亚市海棠区海棠北路',
    phone: '0898-88889999',
    description: '三亚海棠湾度假酒店位于海滨，拥有私人沙滩，是度假休闲的绝佳选择。',
    priceRange: '¥1500-4000',
    starRating: 5,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室', 'SPA'],
    hotelType: 'overseas',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
    ],
    roomTypes: [
      {
        id: 'r11',
        name: '海景大床房',
        bedType: '1.8米大床',
        roomSize: '45㎡',
        capacity: '2人',
        floor: '3-8层',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        roomCount: 20,
        price: 1288
      }
    ],
    status: 'offline',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: '武汉江汉路钟点房',
    address: '武汉市江汉区江汉路步行街',
    phone: '027-12345678',
    description: '武汉江汉路钟点房位于繁华商圈，提供灵活的钟点房服务，方便快捷。',
    priceRange: '¥60-150',
    starRating: 2,
    amenities: ['免费WiFi', '空调', '热水'],
    hotelType: 'hourly',
    images: [],
    roomTypes: [],
    status: 'rejected',
    rejectReason: '地址信息不完整',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '11',
    name: '重庆洪崖洞精品酒店',
    address: '重庆市渝中区洪崖洞民俗风貌区',
    phone: '023-66668888',
    description: '重庆洪崖洞精品酒店位于网红景点洪崖洞，夜景绝佳，体验山城魅力。',
    priceRange: '¥400-1000',
    starRating: 4,
    amenities: ['免费WiFi', '停车场', '餐厅', '健身房', '会议室'],
    hotelType: 'domestic',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'
    ],
    roomTypes: [
      {
        id: 'r12',
        name: '江景大床房',
        bedType: '1.8米大床',
        roomSize: '32㎡',
        capacity: '2人',
        floor: '5-12层',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        roomCount: 12,
        price: 488
      }
    ],
    status: 'approved',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z'
  },
  {
    id: '12',
    name: '厦门鼓浪屿民宿',
    address: '厦门市思明区鼓浪屿内厝澳路',
    phone: '0592-88887777',
    description: '厦门鼓浪屿民宿位于世界文化遗产鼓浪屿，体验闽南风情和海岛风光。',
    priceRange: '¥300-800',
    starRating: 3,
    amenities: ['免费WiFi', '餐厅'],
    hotelType: 'homestay',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
    ],
    roomTypes: [
      {
        id: 'r13',
        name: '花园洋房',
        bedType: '1.5米大床',
        roomSize: '25㎡',
        capacity: '2人',
        floor: '1-2层',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400',
        roomCount: 6,
        price: 388
      }
    ],
    status: 'pending',
    merchantId: '1',
    merchantName: '商户1',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
];

// ==================== Axios 实例（已注释，用于未来接入真实后端）====================

/*
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('isAuthenticated');
          window.location.href = '/login';
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error('请求失败:', error.response.data);
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);
*/

// ==================== 认证 API (Mock 版本) ====================

export const authApi = {
  /**
   * 用户登录
   * POST /PClogin
   */
  login: async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    // 真实请求（已注释）:
    // const response = await api.post('/PClogin', { username, password });
    // return response.data;

    // Mock 实现:
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

  /**
   * 用户注册
   * POST /PCregister
   */
  register: async (username: string, password: string, role: UserRole): Promise<ApiResponse<LoginResponse>> => {
    // 真实请求（已注释）:
    // const response = await api.post('/PCregister', { username, password, role });
    // return response.data;

    // Mock 实现:
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
  }
};

// ==================== 商户端酒店 API (Mock 版本) ====================

export const hotelApi = {
  /**
   * 获取当前商户的酒店列表（精简字段，支持分页）
   * GET /hotels/getMerchantHotels?page=1&pageSize=10
   */
  getMerchantHotels: async (params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<MerchantHotelListItem>>> => {
    const { page = 1, pageSize = 10 } = params;

    // 真实请求（已注释）:
    // const response = await api.get('/hotels/getMerchantHotels', { params });
    // return response.data;

    // Mock 实现:
    // 从 sessionStorage 获取当前用户 ID
    const userStr = sessionStorage.getItem('user');
    const merchantId = userStr ? JSON.parse(userStr).id : '1';

    const filteredHotels = mockHotels.filter(hotel => hotel.merchantId === merchantId);

    // 分页逻辑
    const total = filteredHotels.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

    const list = paginatedHotels.map(hotel => ({
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
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  },

  /**
   * 获取酒店详情（完整字段）
   * GET /merchant/hotels/:id
   */
  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.get(`/merchant/hotels/${id}`);
    // return response.data;

    // Mock 实现:
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

  /**
   * 创建或更新酒店
   * POST /merchant/hotels
   * 有 id 时为更新，无 id 时为创建
   */
  saveHotel: async (hotel: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.post('/merchant/hotels', hotel);
    // return response.data;

    // Mock 实现:
    if (hotel.id) {
      // 更新酒店
      const index = mockHotels.findIndex(h => h.id === hotel.id);
      if (index !== -1) {
        mockHotels[index] = {
          ...mockHotels[index],
          ...hotel,
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

  /**
   * 更新房型房间数量（已发布酒店，无需审核）
   * POST /merchant/hotels/:id/room-count
   */
  updateRoomCount: async (id: string, roomTypes: RoomType[]): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.post(`/merchant/hotels/${id}/room-count`, { roomTypes });
    // return response.data;

    // Mock 实现:
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

// ==================== 管理员端 API (Mock 版本) ====================

export const adminApi = {
  /**
   * 获取所有酒店列表（精简字段，支持分页）
   * GET /admin/hotels?page=1&pageSize=10
   */
  getAllHotels: async (params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<AdminHotelListItem>>> => {
    const { page = 1, pageSize = 10 } = params;

    // 真实请求（已注释）:
    // const response = await api.get('/admin/hotels', { params: { page, pageSize } });
    // return response.data;

    // Mock 实现:
    const total = mockHotels.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedHotels = mockHotels.slice(startIndex, endIndex);

    const list = paginatedHotels.map(hotel => ({
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
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  },

  /**
   * 获取酒店详情（完整字段）
   * GET /admin/hotels/:id
   */
  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.get(`/admin/hotels/${id}`);
    // return response.data;

    // Mock 实现:
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

  /**
   * 审核酒店
   * POST /admin/hotels/:id/audit
   */
  auditHotel: async (
    id: string,
    status: 'approved' | 'rejected',
    rejectReason?: string
  ): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.post(`/admin/hotels/${id}/audit`, { status, rejectReason });
    // return response.data;

    // Mock 实现:
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

  /**
   * 上下线酒店
   * POST /admin/hotels/:id/toggle-status
   */
  toggleHotelStatus: async (id: string, status: 'approved' | 'offline'): Promise<ApiResponse<Hotel>> => {
    // 真实请求（已注释）:
    // const response = await api.post(`/admin/hotels/${id}/toggle-status`, { status });
    // return response.data;

    // Mock 实现:
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

// ==================== 默认导出 ====================

// export default api;  // 已注释，使用 Mock API
