import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hotel } from '../services/api';

interface HotelFormDraftStore {
  // 草稿数据（仅用于添加模式）
  draft: Partial<Hotel> & { city?: string; opening_time?: string };
  // 编辑模式数据
  editData: Partial<Hotel> & { city?: string; opening_time?: string };
  // 当前模式
  currentMode: 'add' | 'edit' | null;
  // 表单状态
  isSubmitting: boolean;
  submitError: string | null;
  lastSaved: string | null; // 最后保存时间
  hasDraft: boolean; // 是否有草稿
  
  // 操作方法
  updateDraft: (data: Partial<Hotel> & { city?: string; opening_time?: string }) => void;
  updateEditData: (data: Partial<Hotel> & { city?: string; opening_time?: string }) => void;
  resetDraft: () => void;
  resetEditData: () => void;
  submitDraft: () => Promise<boolean>; // 返回提交是否成功
  submitEdit: () => Promise<boolean>; // 返回提交是否成功
  clearError: () => void;
  loadHotelData: (hotelData: Partial<Hotel> & { city?: string; opening_time?: string }) => void;
  setMode: (mode: 'add' | 'edit') => void;
  checkHasDraft: () => boolean;
}

// 默认草稿值
const defaultDraft: Partial<Hotel> & { city?: string; opening_time?: string } = {
  name: '',
  address: '',
  phone: '',
  description: '',
  minPrice: 0,
  maxPrice: 0,
  starRating: 5,
  amenities: [],
  hotelType: 'domestic',
  region: '',
  city: '',
  opening_time: '',
  images: [],
  roomTypes: []
};

// 检查草稿是否有内容
const isDraftNotEmpty = (draft: typeof defaultDraft): boolean => {
  return (
    draft.name !== '' ||
    draft.address !== '' ||
    draft.phone !== '' ||
    draft.description !== '' ||
    draft.minPrice !== 0 ||
    draft.maxPrice !== 0 ||
    draft.region !== '' ||
    draft.city !== '' ||
    draft.opening_time !== '' ||
    draft.images.length > 0 ||
    draft.roomTypes.length > 0 ||
    draft.amenities.length > 0
  );
};

export const useHotelFormDraftStore = create<HotelFormDraftStore>()(
  persist(
    (set, get) => ({
      draft: { ...defaultDraft },
      editData: { ...defaultDraft },
      currentMode: null,
      isSubmitting: false,
      submitError: null,
      lastSaved: null,
      hasDraft: false,
      
      // 更新草稿（局部更新，仅用于添加模式）
      updateDraft: (data) => {
        const updatedDraft = { ...get().draft, ...data };
        set({
          draft: updatedDraft,
          hasDraft: isDraftNotEmpty(updatedDraft),
          lastSaved: new Date().toLocaleString() // 每次更新草稿时更新保存时间
        });
      },
      
      // 更新编辑数据（仅用于编辑模式）
      updateEditData: (data) => {
        const updatedEditData = { ...get().editData, ...data };
        set({
          editData: updatedEditData,
          // 编辑模式下不更新hasDraft
        });
      },
      
      // 重置草稿
      resetDraft: () => {
        set({ 
          draft: { ...defaultDraft }, 
          lastSaved: null,
          hasDraft: false 
        });
      },
      
      // 重置编辑数据
      resetEditData: () => {
        set({ 
          editData: { ...defaultDraft }
        });
      },
      
      // 提交草稿（发送 API 请求，用于添加模式）
      submitDraft: async () => {
        const { draft } = get();
        set({ isSubmitting: true, submitError: null });
        
        try {
          // 导入 API 服务（避免循环依赖）
          const { hotelApi } = await import('../services/api');
          
          // 发送保存请求
          const response = await hotelApi.saveHotel(draft);
          
          if (response.success) {
            // 保存成功，更新最后保存时间
            set({
              lastSaved: new Date().toLocaleString(),
              isSubmitting: false,
              submitError: null,
            });
            return true;
          } else {
            // 保存失败
            set({
              submitError: response.message || '保存失败',
              isSubmitting: false,
            });
            return false;
          }
        } catch (error) {
          // 网络错误
          set({
            submitError: '网络错误，请稍后重试',
            isSubmitting: false,
          });
          return false;
        }
      },
      
      // 提交编辑数据（发送 API 请求，用于编辑模式）
      submitEdit: async () => {
        const { editData } = get();
        set({ isSubmitting: true, submitError: null });
        
        try {
          // 导入 API 服务（避免循环依赖）
          const { hotelApi } = await import('../services/api');
          
          // 发送保存请求
          const response = await hotelApi.saveHotel(editData);
          
          if (response.success) {
            // 保存成功
            set({
              isSubmitting: false,
              submitError: null,
            });
            return true;
          } else {
            // 保存失败
            set({
              submitError: response.message || '保存失败',
              isSubmitting: false,
            });
            return false;
          }
        } catch (error) {
          // 网络错误
          set({
            submitError: '网络错误，请稍后重试',
            isSubmitting: false,
          });
          return false;
        }
      },
      
      // 清除错误
      clearError: () => {
        set({ submitError: null });
      },
      
      // 加载酒店数据（编辑模式）
      loadHotelData: (hotelData) => {
        set({ 
          editData: { ...hotelData },
          // 编辑模式下不设置hasDraft为true，避免将编辑数据视为草稿
          hasDraft: false
        });
      },
      
      // 设置当前模式
      setMode: (mode) => {
        set({ currentMode: mode });
      },
      
      // 检查是否有草稿
      checkHasDraft: () => {
        const hasDraft = isDraftNotEmpty(get().draft);
        set({ hasDraft });
        return hasDraft;
      }
    }),
    {
      name: 'hotel-form-draft', // 持久化到 localStorage 的键名
      partialize: (state) => ({
        draft: state.draft,
        lastSaved: state.lastSaved
      }),
      // 持久化加载后检查是否有草稿
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasDraft = isDraftNotEmpty(state.draft);
        }
      }
    }
  )
);
