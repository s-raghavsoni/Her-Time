import cors from 'cors';
import { env } from '../config/env.js';

const allowedOrigins = env.corsOrigin.split(',').map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    const error = new Error(`CORS blocked for origin: ${origin}`);
    error.statusCode = 403;
    callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
