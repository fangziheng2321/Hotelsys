import sequelize from '../config/database';
import User from './User';
import Hotel from './Hotel';
import HotelImage from './HotelImage';

// 注册所有模型
const models: any = {
  User,
  Hotel,
  HotelImage
};

// 自动执行模型中定义的 associate 关联关系
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Hotel, HotelImage };
export default models;