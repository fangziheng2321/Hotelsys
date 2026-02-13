import axios, { AxiosInstance, AxiosError } from 'axios';

// ==================== 类型定义 ====================

export type UserRole = 'merchant' | 'admin';

export interface User {
  id: string;
  username: string;
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
  user: User;
}

// ==================== Axios 实例 ====================

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

// ==================== 认证 API ====================

export const authApi = {
  /**
   * 用户登录
   * POST /PClogin
   */
  login: async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/PClogin', { username, password });
    return response.data;
  },

  /**
   * 用户注册
   * POST /PCregister
   */
  register: async (username: string, password: string, role: UserRole): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post('/PCregister', { username, password, role });
    return response.data;
  }
};

// ==================== 商户端酒店 API ====================

export const hotelApi = {
  /**
   * 获取当前商户的酒店列表（精简字段，支持分页）
   * GET /hotels/getMerchantHotels?page=1&pageSize=10
   */
  getMerchantHotels: async (params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<MerchantHotelListItem>>> => {
    const response = await api.get('/hotels/getMerchantHotels', { params });
    return response.data;
  },

  /**
   * 获取酒店详情（完整字段）
   * GET /merchant/hotels/:id
   */
  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await api.get(`/merchant/hotels/${id}`);
    return response.data;
  },

  /**
   * 创建或更新酒店
   * POST /merchant/hotels
   * 有 id 时为更新，无 id 时为创建
   */
  saveHotel: async (hotel: Partial<Hotel>): Promise<ApiResponse<Hotel>> => {
    const response = await api.post('/merchant/hotels', hotel);
    return response.data;
  },

  /**
   * 更新房型房间数量（已发布酒店，无需审核）
   * POST /merchant/hotels/:id/room-count
   */
  updateRoomCount: async (id: string, roomTypes: RoomType[]): Promise<ApiResponse<Hotel>> => {
    const response = await api.post(`/merchant/hotels/${id}/room-count`, { roomTypes });
    return response.data;
  }
};

// ==================== 管理员端 API ====================

export const adminApi = {
  /**
   * 获取所有酒店列表（精简字段，支持分页）
   * GET /admin/hotels?page=1&pageSize=10
   */
  getAllHotels: async (params: PaginationParams = {}): Promise<ApiResponse<PaginatedResponse<AdminHotelListItem>>> => {
    const response = await api.get('/admin/hotels', { params });
    return response.data;
  },

  /**
   * 获取酒店详情（完整字段）
   * GET /admin/hotels/:id
   */
  getHotelById: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await api.get(`/admin/hotels/${id}`);
    return response.data;
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
    const response = await api.post(`/admin/hotels/${id}/audit`, { status, rejectReason });
    return response.data;
  },

  /**
   * 上下线酒店
   * POST /admin/hotels/:id/toggle-status
   */
  toggleHotelStatus: async (id: string, status: 'approved' | 'offline'): Promise<ApiResponse<Hotel>> => {
    const response = await api.post(`/admin/hotels/${id}/toggle-status`, { status });
    return response.data;
  }
};

// ==================== 默认导出 ====================

export default api;
