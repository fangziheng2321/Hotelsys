import axios, { AxiosInstance, AxiosError } from 'axios';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API地址，根据实际情况修改
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
      // 服务器返回错误
      const status = error.response.status;
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
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
      // 请求发送失败（网络问题）
      console.error('网络错误，请检查网络连接');
    } else {
      // 其他错误
      console.error('请求配置错误:', error.message);
    }
    return Promise.reject(error);
  }
);

// 认证相关接口
export const authApi = {
  // 登录
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // 注册
  register: async (username: string, password: string, role: 'merchant' | 'admin') => {
    const response = await api.post('/auth/register', { username, password, role });
    return response.data;
  }
};

// 酒店相关接口（真实API）
export const hotelApi = {
  // 获取当前商户的酒店列表
  getMyHotels: async () => {
    const response = await api.get('/hotels/my');
    return response.data;
  },

  // 获取所有酒店（管理员）
  getAllHotels: async (params?: { status?: string; page?: number; pageSize?: number }) => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  // 获取单个酒店详情
  getHotelById: async (id: string) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  // 创建酒店
  createHotel: async (hotelData: {
    name: string;
    address: string;
    phone: string;
    description?: string;
    priceRange?: string;
    starRating?: number;
    amenities?: string[];
  }) => {
    const response = await api.post('/hotels', hotelData);
    return response.data;
  },

  // 更新酒店
  updateHotel: async (
    id: string,
    hotelData: {
      name?: string;
      address?: string;
      phone?: string;
      description?: string;
      priceRange?: string;
      starRating?: number;
      amenities?: string[];
    },
    forcePending?: boolean
  ) => {
    const response = await api.put(`/hotels/${id}`, hotelData, {
      params: { forcePending }
    });
    return response.data;
  },

  // 审核酒店（管理员）
  auditHotel: async (
    id: string,
    status: 'approved' | 'rejected',
    rejectReason?: string
  ) => {
    const response = await api.post(`/hotels/${id}/audit`, {
      status,
      rejectReason
    });
    return response.data;
  },

  // 上下线酒店
  toggleHotelStatus: async (id: string, status: 'approved' | 'offline') => {
    const response = await api.post(`/hotels/${id}/toggle`, { status });
    return response.data;
  }
};

export default api;
