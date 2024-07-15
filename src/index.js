import http from 'http';
import app from './app';
import { config } from './config';
import { sequelize } from './models';

(async function start() {
  const server = http.createServer(app);
  await sequelize.authenticate();
  // eslint-disable-next-line no-console
  console.log('Database module initialized');
  server.listen(config.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listened on port: ${config.PORT}`);
  });
}()).catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(0);
});
