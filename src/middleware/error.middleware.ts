import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  if (err instanceof TokenExpiredError) {
    res.status(401).json({ success: false, message: 'Token expired' });
    return;
  }

  if (err instanceof JsonWebTokenError) {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }

  // PostgreSQL unique constraint violation
  if ((err as NodeJS.ErrnoException).code === '23505') {
    res.status(409).json({ success: false, message: 'Resource already exists' });
    return;
  }

  // PostgreSQL foreign key violation
  if ((err as NodeJS.ErrnoException).code === '23503') {
    res.status(400).json({ success: false, message: 'Referenced resource not found' });
    return;
  }

  res.status(500).json({ success: false, message: 'Internal server error' });
};
