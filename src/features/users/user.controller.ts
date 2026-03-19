import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const { users, total } = await userService.getAllUsers(page, limit);
    paginatedResponse(res, users, total, page, limit);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params['id'] as string);
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params['id'] as string, req.body);
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await userService.deleteUser(req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, null, 'User deleted successfully');
  } catch (err) {
    next(err);
  }
};

export const updateProfilePhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateProfilePhoto(req.params['id'] as string, req.body);
    if (!user) { errorResponse(res, 'User not found', 404); return; }
    successResponse(res, user, 'Profile photo updated');
  } catch (err) {
    next(err);
  }
};
