import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';
import HotelImage from './HotelImage';

class Hotel extends BaseModel<Hotel> {
  declare merchant_id: number;
  declare name_zh: string;
  declare address: string;
  declare city: string;
  declare district?: string;
  declare latitude?: number;
  declare longitude?: number;
  declare star_rating: number;
  declare status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  declare rejection_reason?: string;
  declare is_featured: boolean;
  declare contact_phone?: string;
  declare facilities?: any; // JSON 字段
  declare description?: string;
  declare hotel_type: 'domestic' | 'overseas' | 'homestay' | 'hourly';
  declare images?: HotelImage[];

  // 定义关联关系的声明
  static associate(models: any) {
    Hotel.belongsTo(models.User, { foreignKey: 'merchant_id', as: 'merchant' });
    Hotel.hasMany(models.HotelImage, { foreignKey: 'hotel_id', as: 'images' });
  }
}

Hotel.initModel(
  {
    merchant_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    name_zh: { type: DataTypes.STRING(100), allowNull: false },
    address: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(50), allowNull: true },
    district: DataTypes.STRING(50),
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
    star_rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: { min: 0, max: 5 }
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'offline'),
      defaultValue: 'draft'
    },
    rejection_reason: DataTypes.TEXT,
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    contact_phone: DataTypes.STRING(20),
    facilities: { type: DataTypes.JSON },
    description: DataTypes.TEXT,
    hotel_type: {
      type: DataTypes.ENUM('domestic', 'overseas', 'homestay', 'hourly'),
      defaultValue: 'domestic'
    }
  },
  {
    tableName: 'hotels',
 
    indexes: [
      { fields: ['city'] },
      { fields: ['status'] },
      { fields: ['star_rating'] }
    ]
  }
);

export default Hotel;