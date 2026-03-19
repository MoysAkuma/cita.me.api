import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { successResponse, errorResponse } from '../../utils/response';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    successResponse(res, result, 'User registered successfully', 201);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === '23505') {
      errorResponse(res, 'Email already registered', 409);
      return;
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    successResponse(res, result, 'Login successful');
  } catch (err) {
    if ((err as Error).message === 'Invalid credentials') {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    await authService.logout(token);
    successResponse(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    successResponse(res, result, 'Token refreshed');
  } catch (err) {
    if ((err as Error).message === 'Invalid refresh token') {
      errorResponse(res, 'Invalid refresh token', 401);
      return;
    }
    next(err);
  }
};
