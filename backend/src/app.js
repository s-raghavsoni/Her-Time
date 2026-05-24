import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { configureProductionStatic } from './middleware/static.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: env.isProduction ? undefined : false,
  }),
);
app.use(compression());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (!env.isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

if (!env.isProduction) {
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Her Time API',
      version: '0.1.0',
      docs: '/api/health',
    });
  });
}

app.use('/api', routes);

configureProductionStatic(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
