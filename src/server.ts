import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export default server;
