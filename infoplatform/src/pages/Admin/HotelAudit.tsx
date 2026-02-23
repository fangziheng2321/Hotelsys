import React, { useState, useEffect } from 'react';
import { adminApi, Hotel, AdminHotelListItem, HotelType, HotelStatus } from '../../services/api';
import HotelDetailModal from '../../components/modal/HotelDetailModal';
import PageHeader from '../../components/common/PageHeader';
import PaginationInfo from '../../components/common/PaginationInfo';
import PaginationControl from '../../components/common/PaginationControl';
import HotelTable from '../../components/common/HotelTable';
import AsyncButton from '../../components/common/AsyncButton';


const HotelAudit: React.FC = () => {
  const [hotels, setHotels] = useState<AdminHotelListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    hotelType: '' as HotelType | '',
    status: '' as HotelStatus | '',
    search: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
      const response = await adminApi.getAllHotels({
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



  // 打开详情弹窗 - 发起详情请求
  const handleOpenDetailModal = async (hotelId: string) => {
    setLoadingDetail(true);
    try {
      const response = await adminApi.getHotelById(hotelId);
      if (response.success) {
        setSelectedHotel(response.data);
        setIsDetailModalOpen(true);
      } else {
        alert('获取酒店详情失败：' + response.message);
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedHotel(null);
  };

  // 审核通过
  const handleApprove = async (hotelId: string) => {
    if (!window.confirm('确定要通过该酒店的审核吗？')) return;

    try {
      const response = await adminApi.auditHotel(hotelId, 'approved');
      if (response.success) {
        alert('审核通过');
        fetchHotels();
      } else {
        alert('操作失败：' + response.message);
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
    }
  };

  // 审核拒绝
  const handleReject = async (hotelId: string, rejectReason: string) => {
    try {
      const response = await adminApi.auditHotel(hotelId, 'rejected', rejectReason);
      if (response.success) {
        alert('已拒绝');
        fetchHotels();
      } else {
        alert('操作失败：' + response.message);
      }
    } catch (err) {
      alert('网络错误，请稍后重试');
    }
  };

  // 上下线操作
  const handleToggleStatus = async (hotelId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'offline' : 'approved';
    const actionText = newStatus === 'offline' ? '下线' : '上线';

    if (!window.confirm(`确定要${actionText}该酒店吗？`)) return;

    try {
      const response = await adminApi.toggleHotelStatus(hotelId, newStatus as 'approved' | 'offline');
      if (response.success) {
        alert(`${actionText}成功`);
        fetchHotels();
      } else {
        alert('操作失败：' + response.message);
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
    <div className="hotel-audit-container">
      <PageHeader title="酒店审核管理" />

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
        isAdmin={true}
        loadingDetail={loadingDetail}
        filters={filters}
        onFilterChange={setFilters}
        renderActions={(hotel, loadingDetail) => (
          <>
            <AsyncButton
              onClick={() => handleOpenDetailModal(hotel.id)}
              disabled={loadingDetail}
              variant="info"
              loading={loadingDetail}
              loadingText="加载中..."
            >
              详情
            </AsyncButton>
            {hotel.status === 'pending' && (
              <>
                <AsyncButton
                  onClick={() => handleApprove(hotel.id)}
                  variant="success"
                >
                  通过
                </AsyncButton>
                <AsyncButton
                  onClick={() => {
                    const reason = window.prompt('请输入拒绝原因：');
                    if (reason) {
                      handleReject(hotel.id, reason);
                    }
                  }}
                  variant="danger"
                >
                  拒绝
                </AsyncButton>
              </>
            )}
            {(hotel.status === 'approved' || hotel.status === 'offline') && (
              <AsyncButton
                onClick={() => handleToggleStatus(hotel.id, hotel.status)}
                variant={hotel.status === 'approved' ? 'secondary' : 'success'}
              >
                {hotel.status === 'approved' ? '下线' : '上线'}
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

      <HotelDetailModal
        hotel={selectedHotel}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default HotelAudit;
