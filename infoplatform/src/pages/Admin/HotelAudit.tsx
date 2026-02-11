import React, { useState, useEffect } from 'react';
import { adminApi, Hotel } from '../../services/api';
import HotelDetailModal from '../../components/HotelDetailModal';

// 酒店列表基础信息类型
interface HotelListItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  merchantName: string;
  status: 'pending' | 'approved' | 'rejected' | 'offline';
  rejectReason?: string;
  firstImage: string;
}

const HotelAudit: React.FC = () => {
  const [hotels, setHotels] = useState<HotelListItem[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getAllHotels();
      if (response.success) {
        setHotels(response.data);
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

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-audit-container">
      <h2>酒店审核管理</h2>
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

      <HotelDetailModal
        hotel={selectedHotel}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default HotelAudit;
