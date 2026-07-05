import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { redis } from './config/redis';

const PORT = parseInt(env.PORT, 10);

async function startServer() {
  try {
    // Connect to Redis
    await redis.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    logger.warn('Server will continue without Redis connection');
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(async () => {
      await redis.quit();
      logger.info('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(async () => {
      await redis.quit();
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

startServer();
