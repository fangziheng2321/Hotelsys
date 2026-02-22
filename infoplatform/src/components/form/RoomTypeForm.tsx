import React, { useState } from 'react';
import { RoomType } from '../../mock/data';
import AsyncButton from '../common/AsyncButton';

interface RoomTypeFormProps {
  roomTypes: RoomType[];
  onChange: (roomTypes: RoomType[]) => void;
  disabled?: boolean;
}

const RoomTypeForm: React.FC<RoomTypeFormProps> = ({ roomTypes, onChange, disabled = false }) => {
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // 初始化空房型数据
  const emptyRoomType: RoomType = {
    id: '',
    name: '',
    bedType: 1.8,
    bedCount: 1,
    roomSize: 30,
    capacity: 2,
    minFloor: 1,
    maxFloor: 1,
    image: '',
    roomCount: 1,
    price: 0
  };

  // 添加房型
  const handleAdd = () => {
    setEditingRoom({ ...emptyRoomType, id: Date.now().toString() });
    setIsAdding(true);
  };

  // 编辑房型
  const handleEdit = (room: RoomType) => {
    setEditingRoom({ ...room });
    setIsAdding(false);
  };

  // 删除房型
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个房型吗？')) {
      onChange(roomTypes.filter(r => r.id !== id));
    }
  };

  // 保存房型
  const handleSave = () => {
    if (!editingRoom) return;

    // 验证必填字段
    if (!editingRoom.name.trim()) {
      alert('请输入房型名称');
      return;
    }

    if (isAdding) {
      onChange([...roomTypes, editingRoom]);
    } else {
      onChange(roomTypes.map(r => r.id === editingRoom.id ? editingRoom : r));
    }

    setEditingRoom(null);
    setIsAdding(false);
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingRoom(null);
    setIsAdding(false);
  };

  // 处理房型图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingRoom) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditingRoom({ ...editingRoom, image: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // 处理输入变化
  const handleInputChange = (field: keyof RoomType, value: string) => {
    if (!editingRoom) return;
    setEditingRoom({ ...editingRoom, [field]: value });
  };

  // 编辑表单
  const renderEditForm = () => {
    if (!editingRoom) return null;

    return (
      <div className="room-type-edit-form">
        <h4>{isAdding ? '添加房型' : '编辑房型'}</h4>
        <div className="room-form-grid">
          <div className="form-group">
            <label>房型名称 <span className="required">*</span></label>
            <input
              type="text"
              value={editingRoom.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="如：豪华大床房"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>床型（单位：米）</label>
            <input
              type="number"
              step="0.1"
              min="0.8"
              max="3.0"
              value={editingRoom.bedType}
              onChange={(e) => setEditingRoom({ ...editingRoom, bedType: Number(e.target.value) || 1.8 })}
              placeholder="如：1.8"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>床的数量</label>
            <input
              type="number"
              min={1}
              value={editingRoom.bedCount}
              onChange={(e) => setEditingRoom({ ...editingRoom, bedCount: Number(e.target.value) || 1 })}
              placeholder="如：1"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>房间大小（平方米）</label>
            <input
              type="number"
              min={1}
              value={editingRoom.roomSize}
              onChange={(e) => setEditingRoom({ ...editingRoom, roomSize: Number(e.target.value) || 0 })}
              placeholder="如：35"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>入住人数</label>
            <input
              type="number"
              min={1}
              value={editingRoom.capacity}
              onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) || 1 })}
              placeholder="如：2"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>价格（元/晚）</label>
            <input
              type="number"
              min={0}
              value={editingRoom.price}
              onChange={(e) => setEditingRoom({ ...editingRoom, price: Number(e.target.value) || 0 })}
              placeholder="如：688"
              disabled={disabled}
            />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 3' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label>最低楼层</label>
                <input
                  type="number"
                  min="1"
                  value={editingRoom.minFloor}
                  onChange={(e) => setEditingRoom({ ...editingRoom, minFloor: Number(e.target.value) || 1 })}
                  placeholder="如：5"
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>最高楼层</label>
                <input
                  type="number"
                  min="1"
                  value={editingRoom.maxFloor}
                  onChange={(e) => setEditingRoom({ ...editingRoom, maxFloor: Number(e.target.value) || 1 })}
                  placeholder="如：10"
                  disabled={disabled}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
          <div className="form-group room-image-upload">
            <label>房型图片</label>
            <div className="room-image-preview">
              {editingRoom.image ? (
                <img src={editingRoom.image} alt="房型预览" />
              ) : (
                <div className="no-image">暂无图片</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={disabled}
                id="room-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="room-image-upload" className="upload-btn">
                {editingRoom.image ? '更换图片' : '上传图片'}
              </label>
            </div>
          </div>
        </div>
        <div className="room-form-actions">
          <AsyncButton type="button" onClick={handleSave} disabled={disabled} variant="primary">
            保存
          </AsyncButton>
          <AsyncButton type="button" onClick={handleCancel} disabled={disabled} variant="secondary">
            取消
          </AsyncButton>
        </div>
      </div>
    );
  };

  return (
    <div className="room-type-form">
      <div className="room-type-header">
        <h3>房型信息</h3>
        {!disabled && !editingRoom && (
          <AsyncButton type="button" onClick={handleAdd} variant="primary">
            + 添加房型
          </AsyncButton>
        )}
      </div>

      {editingRoom && renderEditForm()}

      {roomTypes.length === 0 && !editingRoom ? (
        <div className="no-room-types">暂无房型信息，请点击"添加房型"按钮添加</div>
      ) : (
        <div className="room-type-list">
          {roomTypes.map((room) => (
            <div key={room.id} className="room-type-card">
              <div className="room-type-image">
                {room.image ? (
                  <img src={room.image} alt={room.name} />
                ) : (
                  <div className="no-image-placeholder">无图片</div>
                )}
              </div>
              <div className="room-type-info">
                <h4>{room.name}</h4>
                <div className="room-type-details">
                  <span><strong>床型：</strong>{room.bedType || '-'}{room.bedType ? '（米）' : ''}</span>
                  <span><strong>床数：</strong>{room.bedCount || '-'}</span>
                  <span><strong>面积：</strong>{room.roomSize || '-'}平方米</span>
                  <span><strong>可住：</strong>{room.capacity || '-'}人</span>
                  <span><strong>楼层：</strong>{room.minFloor && room.maxFloor ? `${room.minFloor}-${room.maxFloor}层` : '-'}</span>
                  <span className="room-price"><strong>价格：</strong>¥{room.price}/晚</span>
                </div>
              </div>
              {!disabled && (
                <div className="room-type-actions">
                  <AsyncButton
                    type="button"
                    onClick={() => handleEdit(room)}
                    variant="primary"
                    title="编辑"
                  >
                    编辑
                  </AsyncButton>
                  <AsyncButton
                    type="button"
                    onClick={() => handleDelete(room.id)}
                    variant="danger"
                    title="删除"
                  >
                    删除
                  </AsyncButton>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomTypeForm;