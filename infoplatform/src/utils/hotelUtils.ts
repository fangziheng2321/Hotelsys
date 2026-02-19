import { HotelType, HotelStatus } from '../services/api';

// 获取状态文本
export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '审核中',
    approved: '已发布',
    rejected: '已拒绝',
    offline: '已下线'
  };
  return statusMap[status] || status;
};

// 获取酒店类型文本
export const getHotelTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    domestic: '国内',
    overseas: '海外',
    homestay: '民宿',
    hourly: '钟点房'
  };
  return typeMap[type] || type;
};

// 酒店类型筛选选项
export const hotelTypeOptions = [
  { value: '', label: '类型' },
  { value: 'domestic', label: '国内' },
  { value: 'overseas', label: '海外' },
  { value: 'homestay', label: '民宿' },
  { value: 'hourly', label: '钟点房' }
];

// 酒店状态筛选选项
export const hotelStatusOptions = [
  { value: '', label: '状态' },
  { value: 'pending', label: '审核中' },
  { value: 'approved', label: '已发布' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'offline', label: '已下线' }
];

// 分页默认值
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;