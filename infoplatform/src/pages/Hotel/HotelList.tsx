import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelApi, HotelType, HotelStatus, MerchantHotelListItem, Hotel, RoomType } from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import PaginationInfo from '../../components/common/PaginationInfo';
import PaginationControl from '../../components/common/PaginationControl';
import HotelTable from '../../components/common/HotelTable';
import RoomCountEditModal from '../../components/RoomCountEditModal';
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
    status: '' as HotelStatus | ''
  });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 重置页码为1当筛选条件变化时
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters.hotelType, filters.status]);

  useEffect(() => {
    fetchHotels();
  }, [pagination.page, pagination.pageSize, filters.hotelType, filters.status]);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await hotelApi.getMerchantHotels({
        page: pagination.page,
        pageSize: pagination.pageSize,
        hotelType: filters.hotelType || undefined,
        status: filters.status || undefined
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
        if (response.data.status === 'approved' && response.data.roomTypes.length > 0) {
          setSelectedHotel(response.data);
          setIsModalOpen(true);
        } else {
          alert('该酒店暂无可编辑的房型');
        }
      } else {
        alert('获取酒店详情失败：' + response.message);
      }
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
          <Link to="/hotel/add">
            <button className="primary-button">添加酒店</button>
          </Link>
        }
      />

      {/* 分页信息 */}
      <PaginationInfo
        total={pagination.total}
        page={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      <HotelTable
        hotels={hotels}
        isAdmin={false}
        loadingDetail={loadingDetail}
        filters={filters}
        onFilterChange={setFilters}
        renderActions={(hotel, loadingDetail) => (
          <>
            <Link to={`/hotel/edit/${hotel.id}`}>
              <button>{hotel.status === 'pending' ? '查看' : '编辑'}</button>
            </Link>
            {hotel.status === 'approved' && (
              <button
                onClick={() => handleOpenRoomCountModal(hotel.id)}
                className="btn-room-count"
                disabled={loadingDetail}
              >
                {loadingDetail ? '加载中...' : '编辑房间数量'}
              </button>
            )}
            {hotel.status === 'rejected' && hotel.rejectReason && (
              <button
                onClick={() => alert(`拒绝原因：${hotel.rejectReason}`)}
                className="btn-reason"
              >
                原因
              </button>
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
