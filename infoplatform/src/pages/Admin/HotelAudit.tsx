import React, { useState, useEffect } from 'react';
import { adminApi, Hotel, AdminHotelListItem } from '../../services/api';
import HotelDetailModal from '../../components/HotelDetailModal';

const HotelAudit: React.FC = () => {
  const [hotels, setHotels] = useState<AdminHotelListItem[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, [pagination.page, pagination.pageSize]);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getAllHotels({
        page: pagination.page,
        pageSize: pagination.pageSize
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

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '审核中',
      approved: '已发布',
      rejected: '已拒绝',
      offline: '已下线'
    };
    return statusMap[status as keyof typeof statusMap] || status;
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

  // 生成分页按钮
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 第一页按钮
    if (startPage > 1) {
      buttons.push(
        <button key={1} onClick={() => handlePageChange(1)} className="page-btn">
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="page-ellipsis">...</span>);
      }
    }

    // 中间页码按钮
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-btn ${i === pagination.page ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // 最后一页按钮
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="page-ellipsis">...</span>);
      }
      buttons.push(
        <button
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="page-btn"
        >
          {pagination.totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-audit-container">
      <h2>酒店审核管理</h2>

      {/* 分页信息 */}
      <div className="pagination-info">
        <span>共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页</span>
        <div className="page-size-selector">
          <span>每页显示：</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <table className="hotel-table">
        <thead>
          <tr>
            <th>图片</th>
            <th>酒店名称</th>
            <th>地址</th>
            <th>联系电话</th>
            <th>商户名称</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.id}>
              <td>
                {hotel.firstImage ? (
                  <img
                    src={hotel.firstImage}
                    alt={hotel.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '12px',
                      border: '1px solid #ddd'
                    }}
                  >
                    无图片
                  </div>
                )}
              </td>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.phone}</td>
              <td>{hotel.merchantName}</td>
              <td>{getStatusText(hotel.status)}</td>
              <td>
                <button
                  onClick={() => handleOpenDetailModal(hotel.id)}
                  disabled={loadingDetail}
                >
                  {loadingDetail ? '加载中...' : '查看详情'}
                </button>

                {hotel.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(hotel.id)}
                      className="btn-approve"
                    >
                      通过
                    </button>
                    <button
                      onClick={() => {
                        const reason = window.prompt('请输入拒绝原因：');
                        if (reason) {
                          handleReject(hotel.id, reason);
                        }
                      }}
                      className="btn-reject"
                    >
                      拒绝
                    </button>
                  </>
                )}

                {hotel.status === 'approved' && (
                  <button
                    onClick={() => handleToggleStatus(hotel.id, hotel.status)}
                    className="btn-offline"
                  >
                    下线
                  </button>
                )}

                {hotel.status === 'offline' && (
                  <button
                    onClick={() => handleToggleStatus(hotel.id, hotel.status)}
                    className="btn-online"
                  >
                    上线
                  </button>
                )}

                {hotel.status === 'rejected' && (
                  <div className="reject-reason">
                    原因：{hotel.rejectReason || '未填写'}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 分页控制 */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="page-btn prev"
          >
            上一页
          </button>
          {renderPageButtons()}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="page-btn next"
          >
            下一页
          </button>
        </div>
      )}

      <HotelDetailModal
        hotel={selectedHotel}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default HotelAudit;
