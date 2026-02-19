// src/models/AuditLog.ts
import { DataTypes } from 'sequelize';
import { BaseModel } from './BaseModel';

class AuditLog extends BaseModel<AuditLog> {
  declare hotel_id: number;
  declare admin_id: number;
  declare action: 'approve' | 'reject' | 'offline' | 'online';
  declare reason?: string;

  static associate(models: any) {
    AuditLog.belongsTo(models.Hotel, { foreignKey: 'hotel_id' });
    AuditLog.belongsTo(models.User, { foreignKey: 'admin_id', as: 'admin' });
  }
}

AuditLog.initModel(
  {
    hotel_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    admin_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('approve', 'reject', 'offline', 'online'),
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      comment: '审核意见/拒绝原因'
    }
  },
  {
    tableName: 'audit_logs',
    updatedAt: false 
  }
);

export default AuditLog;