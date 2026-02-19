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


  static initModel(
    attributes: ModelAttributes,
    options: Omit<InitOptions, 'sequelize'> = {}
  ) {
    const defaultOptions: InitOptions = {
      sequelize,
      timestamps: true,
      underscored: true,
      tableName: this.name.toLowerCase() + 's',
      ...options
    };

    return super.init(attributes, defaultOptions);
  }
}
