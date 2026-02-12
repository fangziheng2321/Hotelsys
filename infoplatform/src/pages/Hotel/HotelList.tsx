import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelApi, Hotel, HotelType, RoomType } from '../../services/api';
import RoomCountEditModal from '../../components/RoomCountEditModal';

// 商户端酒店列表基础信息类型
interface MerchantHotelListItem {
  id: string;
  name: string;
  address: string;
  phone: string;
  hotelType: HotelType;
  status: 'pending' | 'approved' | 'rejected' | 'offline';
  firstImage: string;
}

const HotelList: React.FC = () => {
  const [hotels, setHotels] = useState<MerchantHotelListItem[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // 使用真实API获取商户的酒店列表
      const response = await hotelApi.getMerchantHotels();
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

  const getHotelTypeText = (type: HotelType) => {
    const typeMap = {
      domestic: '国内',
      overseas: '海外',
      homestay: '民宿',
      hourly: '钟点房'
    };
    return typeMap[type] || type;
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

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotel-list-container">
      <h2>我的酒店</h2>
      <div className="action-bar">
        <Link to="/hotel/add">
          <button>添加酒店</button>
        </Link>
      </div>
      <table className="hotel-table">
        <thead>
          <tr>
            <th>图片</th>
            <th>酒店名称</th>
            <th>酒店类型</th>
            <th>地址</th>
            <th>联系电话</th>
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
              <td>{getHotelTypeText(hotel.hotelType)}</td>
              <td>{hotel.address}</td>
              <td>{hotel.phone}</td>
              <td>{getStatusText(hotel.status)}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
