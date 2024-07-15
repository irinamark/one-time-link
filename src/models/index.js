import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/sequelize';

import Link from './Link';

const {
  database, username, password, ...configs
} = dbConfig;
const sequelize = new Sequelize(database, username, password, configs);

// initialize models
Link.initialize(sequelize);

export {
  sequelize,
  Sequelize,
  Link,
};
