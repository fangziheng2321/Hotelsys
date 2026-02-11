import sequelize from '../config/database';
import User from './User';
import Hotel from './Hotel';
import HotelImage from './HotelImage';
import Room from './Room';

// 注册所有模型
const models: any = {
  User,
  Hotel,
  HotelImage,
  Room
};

// 自动执行模型中定义的 associate 关联关系
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// 注意：Room 模型没有定义 associate 方法，所以需要在这里定义关联
Hotel.hasMany(Room, { foreignKey: 'hotel_id', as: 'roomTypes' });
Room.belongsTo(Hotel, { foreignKey: 'hotel_id' });

// Hotel 和 HotelImage 的关联已经在各自的 associate 方法中定义
// 不需要重复定义，否则会导致别名冲突

export { sequelize, User, Hotel, HotelImage ,Room };
export default models;
