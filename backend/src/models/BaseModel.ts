// src/models/BaseModel.ts
import {
  Model,
  ModelAttributes,
  InitOptions
} from 'sequelize';
import sequelize from '../config/database';

export class BaseModel<T extends Model = Model> extends Model {
  declare id: number;           
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date | null;


  static initModel(
    attributes: ModelAttributes,
    options: Omit<InitOptions, 'sequelize'> = {}
  ) {
    const defaultOptions: InitOptions = {
      sequelize,
      timestamps: true,
      underscored: true,
      paranoid: true, // 软删除，delete 操作会填充 deleted_at 而非真正删除
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
      tableName: this.name.toLowerCase() + 's',
      ...options
    };

    return super.init(attributes, defaultOptions);
  }
}
