import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { redis } from '../config/redis';
import { errorResponse } from '../utils/response';

export interface JwtPayload {
  sub: string;
  jti: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    errorResponse(res, 'Unauthorized', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Check token blacklist in Redis
    const isBlacklisted = await redis.get(`blacklist:${payload.jti}`);
    if (isBlacklisted) {
      errorResponse(res, 'Token has been revoked', 401);
      return;
    }

    req.user = payload;
    next();
  } catch {
    errorResponse(res, 'Invalid or expired token', 401);
  }
};
