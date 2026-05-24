import { Router } from 'express';
import { checkDatabaseConnection } from '../config/database.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', async (_req, res) => {
  let healthy;

  try {
    await checkDatabaseConnection();
    healthy = true;
  } catch {
    healthy = false;
  }

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? 'ok' : 'degraded',
    service: 'her-time-api',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    checks: {
      database: healthy ? 'connected' : 'disconnected',
    },
  });
});

export default router;
