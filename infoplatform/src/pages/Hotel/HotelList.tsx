import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelApi, HotelType, HotelStatus, MerchantHotelListItem, Hotel, RoomType } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import PaginationInfo from '../../components/common/PaginationInfo';
import PaginationControl from '../../components/common/PaginationControl';
import HotelTable from '../../components/common/HotelTable';
import AsyncButton from '../../components/common/AsyncButton';
import RoomCountEditModal from '../../components/modal/RoomCountEditModal';
import { AuthService } from '../../utils/auth';

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<MerchantHotelListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  
  // 获取当前用户信息
  const currentUser = AuthService.getCurrentUser();
  const [filters, setFilters] = useState({
    hotelType: '' as HotelType | '',
    status: '' as HotelStatus | '',
    search: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 搜索提交函数
  const handleSearchSubmit = () => {
    setFilters({ ...filters, search: searchInput });
  };

  useEffect(() => {
    // 重置页码为1当筛选条件变化时
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters.hotelType, filters.status, filters.search]);

  useEffect(() => {
    fetchHotels();
  }, [pagination.page, pagination.pageSize, filters.hotelType, filters.status, filters.search]);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await hotelApi.getMerchantHotels({
        page: pagination.page,
        pageSize: pagination.pageSize,
        hotelType: filters.hotelType || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined
      });
      if (response.success && response.data) {
        setHotels(response.data.list);
        setPagination(prev => ({
          ...prev,
          total: response.data!.total,
          totalPages: response.data!.totalPages
        }));
      } else {
        setError(response.message || '获取酒店列表失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };



  // 打开房间数量编辑弹窗 - 先请求完整详情
  const handleOpenRoomCountModal = async (hotelId: string) => {
    setLoadingDetail(true);
    try {
      const response = await hotelApi.getHotelById(hotelId);
      if (response.success) {
        console.log('API返回的完整数据:', response.data); // 添加日志
        
        // 处理房型数据，确保所有需要的字段都存在且类型正确
        const hotelData = { ...response.data };
        
        // 确保 roomTypes 是数组
        if (!Array.isArray(hotelData.roomTypes)) {
          console.error('roomTypes 不是数组:', hotelData.roomTypes);
          alert('获取房型信息失败：数据格式错误');
          return;
        }
        
        // 处理每个房型
        hotelData.roomTypes = hotelData.roomTypes.map((room: any) => {
          console.log('原始房型数据:', room); // 添加日志
          
          // 清理并转换 maxFloor
          let cleanedMaxFloor = room.maxFloor;
          if (typeof cleanedMaxFloor === 'string') {
            // 移除 "层" 字和其他非数字字符
            cleanedMaxFloor = cleanedMaxFloor.replace(/[^0-9]/g, '');
          }
          
          return {
            ...room,
            id: room.id || '',
            name: room.name || '未知房型',
            minFloor: Number(room.minFloor) || 1,
            maxFloor: Number(cleanedMaxFloor) || 1,
            roomCount: Number(room.roomCount) || 0,
            bedType: Number(room.bedType) || 1.8,
            roomSize: Number(room.roomSize) || 30,
            capacity: Number(room.capacity) || 2,
            price: Number(room.price) || 0,
            image: room.image || ''
          };
        });
        
        console.log('处理后的房型数据:', hotelData.roomTypes); // 添加日志
        
        // 检查房型数量
        if (hotelData.roomTypes.length > 0) {
          setSelectedHotel(hotelData);
          setIsModalOpen(true);
        } else {
          console.log('无法打开弹窗的原因:', {
            status: hotelData.status,
            roomTypesLength: hotelData.roomTypes.length
          });
          alert('该酒店暂无可编辑的房型');
        }
      } else {
        alert('获取酒店详情失败：' + response.message);
      }
    } catch (error) {
      console.error('获取酒店详情出错:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  // 保存房间数量
  const handleSaveRoomCount = async (hotelId: string, updatedRoomTypes: RoomType[]) => {
    try {
      const response = await hotelApi.updateRoomCount(hotelId, updatedRoomTypes);
      if (response.success) {
        alert('房间数量更新成功');
      } else {
        alert('更新失败：' + response.message);
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
    }
  };

  // 分页控制
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({
      page: 1,
      pageSize: newPageSize,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / newPageSize)
    });
  };



  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-list-container">
      <PageHeader
        title={`${currentUser?.username}的酒店`}
        action={
          <Link to="/hotel/add" style={{ textDecoration: 'none' }}>
            <AsyncButton variant="primary">添加酒店</AsyncButton>
          </Link>
        }
      />

      {/* 分页信息和搜索 */}
      <PaginationInfo
        total={pagination.total}
        page={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
        search={filters.search}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <HotelTable
        hotels={hotels}
        isAdmin={false}
        loadingDetail={loadingDetail}
        filters={filters}
        onFilterChange={setFilters}
        renderActions={(hotel, loadingDetail) => (
          <>
            <Link to={`/hotel/edit/${hotel.id}`} style={{ textDecoration: 'none' }}>
              <AsyncButton variant={hotel.status === 'pending' ? 'info' : 'primary'}>
                {hotel.status === 'pending' ? '查看' : '编辑'}
              </AsyncButton>
            </Link>
            {hotel.status === 'approved' && (
              <AsyncButton
                onClick={() => handleOpenRoomCountModal(hotel.id)}
                variant="secondary"
                loading={loadingDetail}
                loadingText="加载中..."
              >
                编辑房间数量
              </AsyncButton>
            )}
            {hotel.status === 'rejected' && hotel.rejectReason && (
              <AsyncButton
                onClick={() => alert(`拒绝原因：${hotel.rejectReason}`)}
                variant="danger"
              >
                原因
              </AsyncButton>
            )}
          </>
        )}
      />

      {/* 分页控制 */}
      <PaginationControl
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <RoomCountEditModal
        hotel={selectedHotel}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRoomCount}
      />
    </div>
  );
};

export default HotelList;
