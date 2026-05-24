import app from './src/app.js';
import { env } from './src/config/env.js';
import { closeDatabasePool } from './src/config/database.js';

const server = app.listen(env.port, () => {
  console.log(`[server] Her Time API listening on port ${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`[server] Received ${signal}, shutting down gracefully...`);

  server.close(async () => {
    try {
      await closeDatabasePool();
      console.log('[server] Shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('[server] Error during shutdown', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception', err);
  shutdown('uncaughtException');
});
