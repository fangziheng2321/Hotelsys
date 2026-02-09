import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockApi } from '../../mock/data';

const HotelForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const hotelId = id;
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    priceRange: '',
    starRating: 1,
    amenities: [] as string[]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string>('');
  const [canEdit, setCanEdit] = useState(true);

  // 编辑模式：加载酒店数据
  useEffect(() => {
    if (hotelId) {
      setLoading(true);
      const response = mockApi.getHotelById(hotelId);
      if (response.success) {
        const hotel = response.data;
        setOriginalStatus(hotel.status);
        // 审核中的酒店不可编辑
        if (hotel.status === 'pending') {
          setCanEdit(false);
          setError('该酒店正在审核中，暂时不可编辑');
        }
        setFormData({
          name: hotel.name,
          address: hotel.address,
          phone: hotel.phone,
          description: hotel.description,
          priceRange: hotel.priceRange,
          starRating: hotel.starRating,
          amenities: hotel.amenities
        });
      } else {
        setError('加载酒店信息失败：' + response.message);
      }
      setLoading(false);
    }
  }, [hotelId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(item => item !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    // 酒店名称验证
    if (!formData.name.trim()) {
      setError('请输入酒店名称');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('酒店名称至少2个字符');
      return false;
    }

    // 酒店地址验证
    if (!formData.address.trim()) {
      setError('请输入酒店地址');
      return false;
    }

    // 联系电话验证
    if (!formData.phone.trim()) {
      setError('请输入联系电话');
      return false;
    }



    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    // 判断是否需要强制设为审核中（编辑已发布/已拒绝/已下线的酒店时）
    const forcePending = hotelId && originalStatus !== 'pending' && originalStatus !== '';

    // 调用Api保存酒店信息
    const response = mockApi.saveHotel({
      id: hotelId,
      ...formData
    });

    if (response.success) {
      if (forcePending) {
        alert('酒店信息已修改，状态已重置为"审核中"，请等待管理员审核');
      } else {
        alert(hotelId ? '酒店信息更新成功' : '酒店创建成功');
      }
      navigate('/hotel'); // 跳转到酒店列表页
    } else {
      setError(response.message || '保存失败，请重试');
    }

    setSaving(false);
  };

  // 加载中显示
  if (loading) {
    return (
      <div className="hotel-form-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  return (
    <div className="hotel-form-container">
      <h2>{hotelId ? '编辑酒店信息' : '录入酒店信息'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>酒店名称 <span className="required">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入酒店名称"
            disabled={saving || !canEdit}
          />
        </div>
        <div className="form-group">
          <label>酒店地址 <span className="required">*</span></label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="请输入详细地址"
            disabled={saving || !canEdit}
          />
        </div>
        <div className="form-group">
          <label>联系电话 <span className="required">*</span></label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号或座机号"
            disabled={saving || !canEdit}
          />
        </div>
        <div className="form-group">
          <label>酒店描述</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="请输入酒店描述（选填）"
            disabled={saving || !canEdit}
          />
        </div>
        <div className="form-group">
          <label>价格范围</label>
          <input
            type="text"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            placeholder="例如: ¥200-500"
            disabled={saving || !canEdit}
          />
        </div>
        <div className="form-group">
          <label>星级评分</label>
          <select
            name="starRating"
            value={formData.starRating}
            onChange={handleChange}
            disabled={saving || !canEdit}
          >
            {[1, 2, 3, 4, 5].map(star => (
              <option key={star} value={star}>{star}星</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>设施服务</label>
          <div className="amenities-list">
            {['免费WiFi', '停车场', '餐厅', '健身房', '游泳池', '会议室', '洗衣服务', '24小时前台'].map(amenity => (
              <label key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  disabled={saving || !canEdit}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>
        <div className="form-actions">
          {canEdit && (
            <button type="submit" disabled={saving}>
              {saving ? '保存中...' : (hotelId ? '更新' : '保存')}
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/hotel')}
            disabled={saving}
          >
            返回
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
