import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(backendRoot, '.env') });

const defaults = {
  NODE_ENV: 'development',
  PORT: '5000',

  DB_HOST: 'localhost',
  DB_PORT: '5432',
  DB_USER: 'postgres',
  DB_PASSWORD: '',
  DB_NAME: 'her_time',

  CORS_ORIGIN: 'http://localhost:5173',
};
const requiredInProduction = ['DATABASE_URL'];

function getEnv(key) {
  return process.env[key] ?? defaults[key];
}

const nodeEnv = getEnv('NODE_ENV');
const isProduction = nodeEnv === 'production';

if (isProduction) {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[env] Missing required variables in production: ${missing.join(', ')}`);
    process.exit(1);
  }
} else {
  const recommended = ['NODE_ENV', 'PORT', 'DATABASE_URL'];
  const missing = recommended.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[env] Using defaults for: ${missing.join(', ')}`);
  }
}

export const env = {
  nodeEnv,
  port: Number(getEnv('PORT')),

  dbHost: getEnv('DB_HOST'),
  dbPort: Number(getEnv('DB_PORT')),
  dbUser: getEnv('DB_USER'),
  dbPassword: getEnv('DB_PASSWORD'),
  dbName: getEnv('DB_NAME'),

  corsOrigin: getEnv('CORS_ORIGIN'),
  isProduction,
  backendRoot,
};