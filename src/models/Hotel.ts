import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class Hotel extends BaseModel<Hotel> {
  public merchant_id!: number;
  public name_zh!: string;
  public name_en?: string;
  public address!: string;
  public city!: string;
  public district?: string;
  public latitude?: number;
  public longitude?: number;
  public star_rating!: number;
  public opening_date!: Date;
  public status!: 'draft' | 'pending' | 'approved' | 'rejected' | 'offline';
  public rejection_reason?: string;
  public is_featured!: boolean;
  public contact_phone?: string;
  public contact_email?: string;
  public facilities?: any; // JSON 字段
  public nearby_attractions?: any;
  public transportation_info?: any;
  public description?: string;
  public total_rooms!: number;
  public average_rating!: number;
  public review_count!: number;

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
      allowNull: false
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
      allowNull: false
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