export const dbConfig = {
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'secret',
  database: process.env.PGDATABASE || 'postgres',
  host: process.env.PGHOST || 'postgres',
  port: parseInt(process.env.PGPORT || 5432, 10),
  dialect: 'postgres',
  logging: false,
};

// sequelize cli required environments
export const production = dbConfig;
export const development = dbConfig;
