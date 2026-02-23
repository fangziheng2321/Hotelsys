import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hotelApi, Hotel, HotelType } from '../../services/api';
import RoomTypeForm from '../../components/form/RoomTypeForm';
import AsyncButton from '../../components/common/AsyncButton';

const HotelForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // 省份和城市映射
  const provinceCityMap: { [key: string]: string[] } = {
    '北京': ['北京'],
    '天津': ['天津'],
    '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'],
    '山西': ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'],
    '内蒙古': ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
    '辽宁': ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'],
    '吉林': ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边朝鲜族自治州'],
    '黑龙江': ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭地区'],
    '上海': ['上海'],
    '江苏': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
    '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
    '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城'],
    '福建': ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'],
    '江西': ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'],
    '山东': ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'],
    '河南': ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'],
    '湖北': ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施土家族苗族自治州', '仙桃', '潜江', '天门', '神农架林区'],
    '湖南': ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西土家族苗族自治州'],
    '广东': ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
    '广西': ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左'],
    '海南': ['海口', '三亚', '三沙', '儋州', '五指山', '琼海', '文昌', '万宁', '东方', '定安', '屯昌', '澄迈', '临高', '白沙黎族自治县', '昌江黎族自治县', '乐东黎族自治县', '陵水黎族自治县', '保亭黎族苗族自治县', '琼中黎族苗族自治县'],
    '重庆': ['重庆'],
    '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州'],
    '贵州': ['贵阳', '六盘水', '遵义', '安顺', '铜仁', '毕节', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州'],
    '云南': ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州'],
    '西藏': ['拉萨', '昌都', '山南', '日喀则', '那曲', '阿里', '林芝'],
    '陕西': ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'],
    '甘肃': ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏回族自治州', '甘南藏族自治州'],
    '青海': ['西宁', '海东', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州'],
    '宁夏': ['银川', '石嘴山', '吴忠', '固原', '中卫'],
    '新疆': ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏', '克孜勒苏柯尔克孜自治州', '喀什', '和田', '伊犁哈萨克自治州', '塔城', '阿勒泰', '石河子', '阿拉尔', '图木舒克', '五家渠', '北屯', '铁门关', '双河', '可克达拉', '昆玉', '胡杨河', '新星']
  };

  const [formData, setFormData] = useState<Partial<Hotel> & { city?: string; opening_time?: string }>({
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
    city: '',
    opening_time: '',
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
        // 处理房型数据，确保minFloor和maxFloor是数字类型
        const hotelData = { ...response.data };
        if (hotelData.roomTypes) {
          hotelData.roomTypes = hotelData.roomTypes.map((room: any) => ({
            ...room,
            minFloor: Number(room.minFloor) || 1,
            maxFloor: Number(room.maxFloor) || 1
          }));
        }
        setFormData(hotelData);
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
    
    if (name === 'region') {
      // 当省份变化时，重置城市
      setFormData(prev => ({ 
        ...prev, 
        region: value,
        city: '' // 重置城市
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    if (formData.hotelType !== 'overseas' && !formData.city?.trim()) return '城市不能为空';
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
                <label>省份/直辖市 *</label>
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
                <label>城市 *</label>
                {formData.hotelType === 'overseas' ? (
                  <input
                    type="text"
                    name="city"
                    value="海外"
                    readOnly
                    disabled={isReadOnly}
                  />
                ) : (
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={isReadOnly || !formData.region}
                  >
                    <option value="">请选择城市</option>
                    {formData.region && provinceCityMap[formData.region]?.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group form-half">
                <label>开业时间</label>
                <select
                  name="opening_time"
                  value={formData.opening_time}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, opening_time: e.target.value }));
                  }}
                  disabled={isReadOnly}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">请选择年份</option>
                  {Array.from({ length: 50 }, (_, i) => 2026 - i).map(year => (
                    <option key={year} value={year.toString()}>
                      {year}年
                    </option>
                  ))}
                </select>
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
            <AsyncButton 
              type="submit" 
              loading={loading}
              loadingText="保存中..."
              variant="primary"
            >
              保存
            </AsyncButton>
          )}
          <AsyncButton 
            type="button" 
            onClick={() => navigate('/hotel')}
            variant="secondary"
          >
            {isReadOnly ? '返回' : '取消'}
          </AsyncButton>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
