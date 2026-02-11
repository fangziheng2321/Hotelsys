// src/models/Room.ts
import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

export class Room extends BaseModel<Room> {
  declare hotel_id: number;
  declare name: string;           
  declare bed_type: string;       
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
    bed_type: {
      type: DataTypes.STRING(50),
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
  },
  {
    tableName: 'rooms',
  }
);

export default Room;