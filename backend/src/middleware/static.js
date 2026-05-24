import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../../frontend/dist');
const indexHtml = path.join(frontendDist, 'index.html');

export function configureProductionStatic(app) {
  if (!env.isProduction) {
    return;
  }

  if (!fs.existsSync(indexHtml)) {
    console.warn(
      '[static] frontend/dist/index.html not found. Run "npm run build" from the repo root.',
    );
    return;
  }

  app.use(express.static(frontendDist));

  app.get(/^(?!\/api).*/, (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    res.sendFile(indexHtml, (err) => {
      if (err) {
        next(err);
      }
    });
  });
}
