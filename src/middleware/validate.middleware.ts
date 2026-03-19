import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';

interface ValidationTargets {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export const validate = (schemas: ValidationTargets) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errorResponse(res, 'Validation error', 400, result.error.errors);
        return;
      }
      req.body = result.data;
    }
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errorResponse(res, 'Invalid parameters', 400, result.error.errors);
        return;
      }
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errorResponse(res, 'Invalid query parameters', 400, result.error.errors);
        return;
      }
    }
    next();
  };
};
