import _ from 'lodash';
import { Model, DataTypes } from 'sequelize';
import { NotFound } from 'http-errors';

const DateKeys = ['createdAt', 'updatedAt'];

export default class BaseModel extends Model {
  static modelName = 'baseModel';

  static tableName = 'baseModels';

  static associationScopes = {};

  static dateKeys = DateKeys;

  static Settings = {};

  static initialize(sequelize) {
    super.init(this.Schema, {
      modelName: this.modelName,
      tableName: this.tableName,
      ...this.Settings,
      sequelize,
    });
  }

  /**
   *
   * @param {object} where
   * @param {object} options
   * @returns {Promise<BaseModel>}
   */
  static async findOneOrFail(where, options = {}) {
    const doc = await this.findOne({ where, ...options });
    if (!doc) {
      throw new NotFound(this.modelName);
    }
    return doc;
  }

  /**
   *
   * @param {array} scopes
   * @returns {string[]}
   */
  static getAttributes(scopes = []) {
    if (!Array.isArray(scopes)) {
      scopes = [scopes];
    }
    const showDates = scopes.indexOf('dates') !== -1;
    const showRefs = scopes.indexOf('refs') !== -1;

    scopes = _.without(scopes, 'dates', 'refs');

    const realAttributes = _.pickBy(this.rawAttributes, (def, key) => {
      const isVirtual = def.type instanceof DataTypes.VIRTUAL;
      const isReference = def.references;
      const isDate = this.dateKeys.indexOf(key) !== -1;
      let matchScopes = true;
      if (def.scopes) {
        const matchedScopes = def.scopes.filter((scope) => scopes.indexOf(scope) !== -1);
        matchScopes = !!matchedScopes.length;
      }

      return !isVirtual && matchScopes && (showDates || !isDate) && (showRefs || !isReference);
    });

    return _.map(realAttributes, (def) => def.field);
  }

  /**
   *
   * @param {array} scopes
   * @returns {{}}
   */
  publish(scopes = []) {
    if (!Array.isArray(scopes)) {
      scopes = [scopes];
    }
    const schema = this.constructor.Schema || {};
    const { associations, associationScopes } = this.constructor;

    const showDates = scopes.indexOf('dates') !== -1;
    const showRefs = scopes.indexOf('refs') !== -1;

    scopes = _.without(scopes, 'dates', 'refs');
    let instanceKeys = Object.keys(this.get());

    instanceKeys = _.without(instanceKeys, ...DateKeys);

    if (!showRefs) {
      const foreignKeys = _.map(associations, 'identifier').filter((key) => key);
      instanceKeys = _.without(instanceKeys, ...foreignKeys);
    }

    const associationKeys = _.filter(instanceKeys, (key) => associations[key]);
    const forbiddenAssocKeys = _.filter(associationKeys, (key) => {
      if (!associationScopes[key]) return false;
      return !_.some(associationScopes[key], scopes);
    });
    instanceKeys = _.without(instanceKeys, ...forbiddenAssocKeys);

    let scopedKeys = instanceKeys.filter((key) => {
      const keyDef = schema[key];
      if (!keyDef || !keyDef.scopes) return true;
      const matchedScope = keyDef.scopes.filter((scope) => scopes.indexOf(scope) !== -1);
      return matchedScope.length;
    });

    if (showDates) {
      scopedKeys = scopedKeys.concat(DateKeys);
    }

    const scoped = {};
    scopedKeys
      .filter((key) => this.get(key) !== undefined)
      .forEach((key) => {
        let value = this.get(key);
        if (_.isArray(value)) {
          value = value.map((v) => {
            if (v instanceof BaseModel) {
              return v.publish(scopes);
            }
            return v;
          });
        } else if (value instanceof BaseModel) {
          value = value.publish(scopes);
        }
        scoped[key] = value;
      });

    return scoped;
  }
}
