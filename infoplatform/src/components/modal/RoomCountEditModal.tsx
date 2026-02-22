import React, { useState, useEffect } from 'react';
import { Hotel, RoomType } from '../../mock/data';
import AsyncButton from '../common/AsyncButton';

interface RoomCountEditModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotelId: string, roomTypes: RoomType[]) => void;
}

const RoomCountEditModal: React.FC<RoomCountEditModalProps> = ({
  hotel,
  isOpen,
  onClose,
  onSave
}) => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hotel && isOpen) {
      setRoomTypes(hotel.roomTypes.map(rt => ({ ...rt })));
    }
  }, [hotel, isOpen]);

  if (!isOpen || !hotel) return null;

  const handleRoomCountChange = (roomId: string, count: number) => {
    if (count < 0) count = 0;
    if (count > 999) count = 999;
    
    setRoomTypes(prev =>
      prev.map(rt =>
        rt.id === roomId ? { ...rt, roomCount: count } : rt
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(hotel.id, roomTypes);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>编辑房间数量 - {hotel.name}</h3>
          <AsyncButton onClick={onClose} variant="secondary" style={{ padding: '5px 10px', fontSize: '16px' }}>
            ×
          </AsyncButton>
        </div>
        
        <div className="modal-body">
          {roomTypes.length === 0 ? (
            <div className="no-room-types-message">
              该酒店暂无房型信息
            </div>
          ) : (
            <div className="room-count-list">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="room-count-item">
                  <div className="room-info">
                    <div className="room-image">
                      {roomType.image ? (
                        <img src={roomType.image} alt={roomType.name} />
                      ) : (
                        <div className="no-image">无图</div>
                      )}
                    </div>
                    <div className="room-details">
                      <h4>{roomType.name}</h4>
                      <p>{roomType.bedType}（米） · {roomType.roomSize}平方米 · {roomType.capacity}人</p>
                      <p className="room-price">¥{roomType.price}/晚</p>
                    </div>
                  </div>
                  <div className="room-count-input-group">
                    <label>房间数量：</label>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={roomType.roomCount}
                      onChange={(e) => handleRoomCountChange(roomType.id, parseInt(e.target.value) || 0)}
                      disabled={saving}
                      className="room-count-input"
                    />
                    <span>间</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <AsyncButton 
            onClick={onClose}
            disabled={saving}
            variant="secondary"
          >
            取消
          </AsyncButton>
          <AsyncButton 
            onClick={handleSave}
            disabled={saving || roomTypes.length === 0}
            variant="primary"
            loading={saving}
            loadingText="保存中..."
          >
            保存
          </AsyncButton>
        </div>
      </div>
    </div>
  );
};

export default RoomCountEditModal;