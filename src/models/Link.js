import { DataTypes } from 'sequelize';
import { v4 as uuid } from 'uuid';
import BaseModel from './BaseModel';
import { LinkStatuses } from '../constants/linkStatuses';

export default class Link extends BaseModel {
  static modelName = 'link';

  static tableName = 'links';

  static protectedKeys = ['createdAt', 'updatedAt'];

  static Schema = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      scopes: ['system'],
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      scopes: ['compact', 'system'],
    },
    status: {
      type: DataTypes.ENUM(...Object.values(LinkStatuses)),
      defaultValue: LinkStatuses.active,
      allowNull: false,
      scopes: ['system'],
    },
  };

  static Settings = {
    // define validators, indexes, hooks and etc here
    hooks: {
      async beforeCreate(link) {
        link.id = uuid();
      },
    },
  };
}
