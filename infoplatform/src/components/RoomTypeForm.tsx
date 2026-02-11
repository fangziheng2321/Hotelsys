import React, { useState } from 'react';
import { RoomType } from '../mock/data';

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
    bedType: '',
    roomSize: '',
    capacity: '',
    floor: '',
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
            <label>床的规格</label>
            <input
              type="text"
              value={editingRoom.bedType}
              onChange={(e) => handleInputChange('bedType', e.target.value)}
              placeholder="如：1.8米大床"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>房间大小</label>
            <input
              type="text"
              value={editingRoom.roomSize}
              onChange={(e) => handleInputChange('roomSize', e.target.value)}
              placeholder="如：35㎡"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>入住人数</label>
            <input
              type="text"
              value={editingRoom.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              placeholder="如：2人"
              disabled={disabled}
            />
          </div>
          <div className="form-group">
            <label>楼层</label>
            <input
              type="text"
              value={editingRoom.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              placeholder="如：5-10层"
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
          <button type="button" onClick={handleSave} disabled={disabled} className="btn-primary">
            保存
          </button>
          <button type="button" onClick={handleCancel} disabled={disabled} className="btn-secondary">
            取消
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="room-type-form">
      <div className="room-type-header">
        <h3>房型信息</h3>
        {!disabled && !editingRoom && (
          <button type="button" onClick={handleAdd} className="btn-add">
            + 添加房型
          </button>
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
                  <span><strong>床型：</strong>{room.bedType || '-'}</span>
                  <span><strong>面积：</strong>{room.roomSize || '-'}</span>
                  <span><strong>可住：</strong>{room.capacity || '-'}</span>
                  <span><strong>楼层：</strong>{room.floor || '-'}</span>
                  <span className="room-price"><strong>价格：</strong>¥{room.price}/晚</span>
                </div>
              </div>
              {!disabled && (
                <div className="room-type-actions">
                  <button
                    type="button"
                    onClick={() => handleEdit(room)}
                    className="btn-edit"
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(room.id)}
                    className="btn-delete"
                    title="删除"
                  >
                    删除
                  </button>
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
