import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hotelApi, Hotel, HotelType } from '../../services/api';
import RoomTypeForm from '../../components/RoomTypeForm';

const HotelForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: '',
    address: '',
    phone: '',
    description: '',
    minPrice: 0,
    maxPrice: 0,
    starRating: 5,
    amenities: [],
    hotelType: 'domestic',
    region: '',
    images: [],
    roomTypes: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // 判断是否为审核中状态（只读模式）
  const isReadOnly = isEdit && formData.status === 'pending';

  useEffect(() => {
    if (isEdit && id) {
      fetchHotelDetail(id);
    }
  }, [isEdit, id]);

  const fetchHotelDetail = async (hotelId: string) => {
    setLoading(true);
    try {
      const response = await hotelApi.getHotelById(hotelId);
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || '获取酒店信息失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStarRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, starRating: rating }));
  };

  // 预设设施选项
  const amenityOptions = [
    '免费WiFi',
    '停车场',
    '餐厅',
    '健身房',
    '游泳池',
    '会议室'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const currentAmenities = prev.amenities || [];
      if (currentAmenities.includes(amenity)) {
        return { ...prev, amenities: currentAmenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenity] };
      }
    });
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleRoomTypesChange = (roomTypes: Hotel['roomTypes']) => {
    setFormData(prev => ({ ...prev, roomTypes }));
  };

  const validateForm = () => {
    if (!formData.name?.trim()) return '酒店名称不能为空';
    if (!formData.address?.trim()) return '地址不能为空';
    if (!formData.phone?.trim()) return '联系电话不能为空';
    if (!formData.region?.trim()) return '地区不能为空';
    if (formData.minPrice === undefined || formData.minPrice < 0) return '最低价格不能为负数';
    if (formData.maxPrice === undefined || formData.maxPrice < 0) return '最高价格不能为负数';
    if (formData.maxPrice < formData.minPrice) return '最高价格不能小于最低价格';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await hotelApi.saveHotel(formData);

      if (response.success) {
        alert(isEdit ? '酒店更新成功' : '酒店创建成功');
        navigate('/hotel');
      } else {
        setError(response.message || '保存失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="hotel-form-container">
      <h2>{isEdit ? '编辑酒店' : '添加酒店'}</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        {isReadOnly && (
          <div className="info-message" style={{ backgroundColor: '#FFF3E0', color: '#E65100', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
            当前酒店正在审核中，仅支持查看，无法编辑
          </div>
        )}

        {/* 基本信息卡片 */}
        <div className="form-card">
          <h3>基本信息</h3>
          <div className="form-card-content">
            <div className="form-row">
              <div className="form-group form-half">
                <label>酒店名称 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                />
              </div>
              <div className="form-group form-half">
                <label>酒店类型 *</label>
                <select
                  name="hotelType"
                  value={formData.hotelType}
                  onChange={(e) => {
                    handleChange(e);
                    // 当选择海外时，自动设置地区为海外
                    if (e.target.value === 'overseas') {
                      setFormData(prev => ({ ...prev, region: '海外' }));
                    }
                  }}
                  required
                  disabled={isReadOnly}
                >
                  <option value="domestic">国内</option>
                  <option value="overseas">海外</option>
                  <option value="homestay">民宿</option>
                  <option value="hourly">钟点房</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-half">
                <label>地区 *</label>
                {formData.hotelType === 'overseas' ? (
                  <input
                    type="text"
                    name="region"
                    value="海外"
                    readOnly
                    disabled={isReadOnly}
                  />
                ) : (
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">请选择省份</option>
                    <option value="北京">北京</option>
                    <option value="天津">天津</option>
                    <option value="河北">河北</option>
                    <option value="山西">山西</option>
                    <option value="内蒙古">内蒙古</option>
                    <option value="辽宁">辽宁</option>
                    <option value="吉林">吉林</option>
                    <option value="黑龙江">黑龙江</option>
                    <option value="上海">上海</option>
                    <option value="江苏">江苏</option>
                    <option value="浙江">浙江</option>
                    <option value="安徽">安徽</option>
                    <option value="福建">福建</option>
                    <option value="江西">江西</option>
                    <option value="山东">山东</option>
                    <option value="河南">河南</option>
                    <option value="湖北">湖北</option>
                    <option value="湖南">湖南</option>
                    <option value="广东">广东</option>
                    <option value="广西">广西</option>
                    <option value="海南">海南</option>
                    <option value="重庆">重庆</option>
                    <option value="四川">四川</option>
                    <option value="贵州">贵州</option>
                    <option value="云南">云南</option>
                    <option value="西藏">西藏</option>
                    <option value="陕西">陕西</option>
                    <option value="甘肃">甘肃</option>
                    <option value="青海">青海</option>
                    <option value="宁夏">宁夏</option>
                    <option value="新疆">新疆</option>
                  </select>
                )}
              </div>
              <div className="form-group form-half">
                <label>联系电话 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="form-group">
              <label>地址 *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isReadOnly}
              />
            </div>

            <div className="form-row">
              <div className="form-group form-half">
                <label>最低价格</label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  placeholder="如：500"
                  min="0"
                  disabled={isReadOnly}
                />
              </div>
              <div className="form-group form-half">
                <label>最高价格</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  placeholder="如：1000"
                  min="0"
                  disabled={isReadOnly}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group form-half">
                <label>星级评分</label>
                <div className={`star-rating ${isReadOnly ? 'disabled' : ''}`}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={star <= (formData.starRating || 0) ? 'star active' : 'star'}
                      onClick={() => !isReadOnly && handleStarRatingChange(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>酒店描述</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {/* 设施与服务卡片 */}
        <div className="form-card">
          <h3>设施与服务</h3>
          <div className="form-card-content">
            <div className="form-group">
              <label>设施服务</label>
              <div className="amenities-checkbox-group">
                {amenityOptions.map(amenity => (
                  <label key={amenity} className={`amenity-checkbox ${isReadOnly ? 'disabled' : ''}`}>
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity) || false}
                      onChange={() => handleAmenityToggle(amenity)}
                      disabled={isReadOnly}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 酒店图片卡片 */}
        <div className="form-card">
          <h3>酒店图片</h3>
          <div className="form-card-content">
            {!isReadOnly && (
              <>
                <div className="image-input-group">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="输入图片URL"
                  />
                  <button type="button" onClick={handleAddImage}>添加图片</button>
                </div>
                <div className="local-upload-section">
                  <label>本地上传图片</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        Array.from(files).forEach((file) => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormData(prev => ({
                                ...prev,
                                images: [...(prev.images || []), event.target.result as string]
                              }));
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                  />
                  <p className="upload-hint">支持批量上传，图片将自动转换为Base64格式</p>
                </div>
              </>
            )}
            <div className="image-preview-list">
              {formData.images?.map((url, index) => (
                <div key={index} className="image-preview-item">
                  <img src={url} alt={`酒店图片${index + 1}`} />
                  {!isReadOnly && (
                    <button type="button" className="delete-image-btn" onClick={() => handleRemoveImage(index)}>
                      <span className="delete-icon">−</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 房型信息卡片 */}
        <div className="form-card">
          <h3>房型信息</h3>
          <div className="form-card-content">
            <RoomTypeForm
              roomTypes={formData.roomTypes || []}
              onChange={handleRoomTypesChange}
              disabled={isReadOnly}
            />
          </div>
        </div>

        {/* 表单操作按钮 */}
        <div className="form-actions">
          {!isReadOnly && (
            <button type="submit" disabled={loading}>
              {loading ? '保存中...' : '保存'}
            </button>
          )}
          <button type="button" onClick={() => navigate('/hotel')}>
            {isReadOnly ? '返回' : '取消'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
