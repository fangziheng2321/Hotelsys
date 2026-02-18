// src/models/Room.ts
import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

export class Room extends BaseModel<Room> {
  declare hotel_id: number;
  declare name: string;           
  declare bed_count: number; 
  declare bed_size: number;
  declare room_size: string;      
  declare capacity: string;       
  declare floor: string;          
  declare image_url: string;      
  declare total_stock: number;    
  declare current_price: number;  
  declare is_active: boolean;

}

Room.initModel(
  {
    hotel_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    
    room_size: {
      type: DataTypes.STRING(20),
    },
    capacity: {
      type: DataTypes.STRING(20),
    },
    floor: {
      type: DataTypes.STRING(20),
    },
    image_url: {
      type: DataTypes.STRING(500),
    },
    total_stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 10,
    },
    current_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    bed_count: {
      type: DataTypes.TINYINT.UNSIGNED,
      defaultValue: 1,
      comment: '床的数量'
    },
    bed_size: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.8,
      comment: '床的尺寸'
    }
  },
  {
    tableName: 'rooms',
  }
);

export default Room;