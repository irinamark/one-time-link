import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import { ErrorHandler } from './middlewares';
import { linkRouter } from './routes';

const swaggerDocument = YAML.load(`${__dirname}/../docs/openapi.yaml`);
const swaggerDarkCss = fs.readFileSync('./docs/SwaggerDark.css', 'utf-8');

const app = express();

// configuration section
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cors());
app.use(morgan('tiny'));

// health check request
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true, customCss: swaggerDarkCss }));

// app routing
app.use('/api/links', linkRouter);

// app error handling
app.use(ErrorHandler);

export default app;
