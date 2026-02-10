import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class HotelImage extends BaseModel<HotelImage> {
  public hotel_id!: number;
  public image_url!: string;
  public image_type!: 'exterior' | 'lobby' | 'room' | 'facility' | 'other';
  public caption?: string;
  public sort_order!: number;
  public is_primary!: boolean;
  public uploaded_by?: number;

  static associate(models: any) {
    HotelImage.belongsTo(models.Hotel, { foreignKey: 'hotel_id' });
    HotelImage.belongsTo(models.User, { foreignKey: 'uploaded_by', as: 'uploader' });
  }
}

HotelImage.initModel(
  {
    hotel_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    image_type: {
      type: DataTypes.ENUM('exterior', 'lobby', 'room', 'facility', 'other'),
      defaultValue: 'other'
    },
    caption: DataTypes.STRING(200),
    sort_order: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 0
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    uploaded_by: DataTypes.INTEGER.UNSIGNED
  },
  {
    tableName: 'hotel_images'
  }
);

export default HotelImage;