// src/models/User.ts
import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class User extends BaseModel<User> {
  declare username: string;
  declare email: string;
  declare password_hash: string;
  declare role: 'admin' | 'merchant' | 'customer';
  declare phone?: string;
  declare avatar_url?: string;
  declare is_active: boolean;
  declare last_login_at?: Date;
}

User.initModel(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '用户ID'
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      },
      comment: '邮箱'
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '加密密码'
    },
    role: {
      type: DataTypes.ENUM('admin', 'merchant', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
      comment: '用户角色'
    },
    phone: {
      type: DataTypes.STRING(20),
      comment: '手机号'
    },
    avatar_url: {
      type: DataTypes.STRING(500),
      comment: '头像URL'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否激活'
    },
    last_login_at: {
      type: DataTypes.DATE,
      comment: '最后登录时间'
    }
  },
  {
    tableName: 'users',
    indexes: [
      {
        name: 'idx_users_role',
        fields: ['role']
      },
      {
        name: 'idx_users_email',
        fields: ['email']
      }
    ]
  }
);

export default User;