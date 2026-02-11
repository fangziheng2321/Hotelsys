import React from 'react';
import { Hotel, HotelType } from '../mock/data';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  isOpen,
  onClose
}) => {
  if (!isOpen || !hotel) return null;

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '审核中',
      approved: '已发布',
      rejected: '已拒绝',
      offline: '已下线'
    };
    return statusMap[status] || status;
  };

  const getHotelTypeText = (type: HotelType) => {
    const typeMap: Record<HotelType, string> = {
      domestic: '国内',
      overseas: '海外',
      homestay: '民宿',
      hourly: '钟点房'
    };
    return typeMap[type] || type;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container detail-modal">
        <div className="modal-header">
          <h3>酒店详情 - {hotel.name}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body detail-body">
          {/* 基本信息 */}
          <div className="detail-section">
            <h4>基本信息</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>酒店名称：</label>
                <span>{hotel.name}</span>
              </div>
              <div className="detail-item">
                <label>酒店类型：</label>
                <span>{getHotelTypeText(hotel.hotelType)}</span>
              </div>
              <div className="detail-item">
                <label>地址：</label>
                <span>{hotel.address}</span>
              </div>
              <div className="detail-item">
                <label>联系电话：</label>
                <span>{hotel.phone}</span>
              </div>
              <div className="detail-item">
                <label>价格范围：</label>
                <span>{hotel.priceRange}</span>
              </div>
              <div className="detail-item">
                <label>星级评分：</label>
                <span>{hotel.starRating}星</span>
              </div>
              <div className="detail-item">
                <label>当前状态：</label>
                <span className={`status-badge status-${hotel.status}`}>
                  {getStatusText(hotel.status)}
                </span>
              </div>
              <div className="detail-item">
                <label>商户名称：</label>
                <span>{hotel.merchantName}</span>
              </div>
            </div>
          </div>

          {/* 酒店描述 */}
          {hotel.description && (
            <div className="detail-section">
              <h4>酒店描述</h4>
              <p className="detail-description">{hotel.description}</p>
            </div>
          )}

          {/* 设施服务 */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="detail-section">
              <h4>设施服务</h4>
              <div className="detail-amenities">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          )}

          {/* 酒店图片 */}
          {hotel.images && hotel.images.length > 0 && (
            <div className="detail-section">
              <h4>酒店图片</h4>
              <div className="detail-images">
                {hotel.images.map((image, index) => (
                  <img key={index} src={image} alt={`酒店图片 ${index + 1}`} />
                ))}
              </div>
            </div>
          )}

          {/* 房型信息 */}
          {hotel.roomTypes && hotel.roomTypes.length > 0 && (
            <div className="detail-section">
              <h4>房型信息</h4>
              <div className="detail-room-types">
                {hotel.roomTypes.map((room) => (
                  <div key={room.id} className="detail-room-card">
                    <div className="room-image">
                      {room.image ? (
                        <img src={room.image} alt={room.name} />
                      ) : (
                        <div className="no-image">无图片</div>
                      )}
                    </div>
                    <div className="room-info">
                      <h5>{room.name}</h5>
                      <p>{room.bedType} · {room.roomSize} · {room.capacity}</p>
                      <p>楼层：{room.floor} · 房间数：{room.roomCount}间</p>
                      <p className="room-price">价格：<strong>¥{room.price}</strong>/晚</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 拒绝原因 */}
          {hotel.rejectReason && (
            <div className="detail-section">
              <h4>拒绝原因</h4>
              <div className="reject-reason-box">
                {hotel.rejectReason}
              </div>
            </div>
          )}

          {/* 时间信息 */}
          <div className="detail-section">
            <h4>时间信息</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <label>创建时间：</label>
                <span>{new Date(hotel.createdAt).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <label>更新时间：</label>
                <span>{new Date(hotel.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailModal;
