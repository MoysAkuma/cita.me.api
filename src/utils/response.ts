import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
): Response => {
  const body: Record<string, unknown> = { success: false, message };
  if (errors !== undefined) body['errors'] = errors;
  return res.status(statusCode).json(body);
};

export const paginatedResponse = (
  res: Response,
  data: unknown,
  total: number,
  page: number,
  limit: number
): Response => {
  return res.status(200).json({
    success: true,
    message: 'Success',
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
