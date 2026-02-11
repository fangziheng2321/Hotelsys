import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class Hotel extends BaseModel<Hotel> {
  declare merchant_id: number;
  declare name_zh: string;
  declare name_en?: string;
  declare address: string;
  declare city: string;
  declare district?: string;
  declare latitude?: number;
  declare longitude?: number;
  declare star_rating: number;
  declare opening_date: Date;
  declare status: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  declare rejection_reason?: string;
  declare is_featured: boolean;
  declare contact_phone?: string;
  declare contact_email?: string;
  declare facilities?: any; // JSON 字段
  declare nearby_attractions?: any;
  declare transportation_info?: any;
  declare description?: string;
  declare total_rooms: number;
  declare average_rating: number;
  declare review_count: number;

  // 定义关联关系的声明
  static associate(models: any) {
    Hotel.belongsTo(models.User, { foreignKey: 'merchant_id', as: 'merchant' });
    Hotel.hasMany(models.HotelImage, { foreignKey: 'hotel_id', as: 'images' });
  }
}

Hotel.initModel(
  {
    merchant_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name_zh: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name_en: DataTypes.STRING(100),
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    district: DataTypes.STRING(50),
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
    star_rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: { min: 0, max: 5 }
    },
    opening_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'offline'),
      defaultValue: 'draft'
    },
    rejection_reason: DataTypes.TEXT,
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    contact_phone: DataTypes.STRING(20),
    contact_email: DataTypes.STRING(100),
    facilities: {
      type: DataTypes.JSON,
      comment: '酒店设施,如:{"wifi": true, "parking": true}'
    },
    nearby_attractions: DataTypes.JSON,
    transportation_info: DataTypes.JSON,
    description: DataTypes.TEXT,
    total_rooms: {
      type: DataTypes.SMALLINT.UNSIGNED,
      defaultValue: 0
    },
    average_rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0
    },
    review_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
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