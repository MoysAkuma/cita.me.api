import { Request, Response, NextFunction } from 'express';
import * as appointmentService from './appointment.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';

const buildResourceUrl = (req: Request, id: string | number): string => {
  const basePath = req.originalUrl.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}${basePath}/${id}`;
};

export const getCitas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const filters = {
      usuarioId: req.query['usuarioId'] as string | undefined,
      proveedorId: req.query['proveedorId'] as string | undefined,
    };
    const { citas, total } = await appointmentService.getCitas(page, limit, filters);
    paginatedResponse(res, citas, total, page, limit);
  } catch (err) { next(err); }
};

export const getCitaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cita = await appointmentService.getCitaById(req.params['id'] as string);
    if (!cita) { errorResponse(res, 'Appointment not found', 404); return; }
    successResponse(res, cita);
  } catch (err) { next(err); }
};

export const createCita = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cita = await appointmentService.createCita(req.user!.sub, req.body);
    successResponse(res, { id: cita.id, url: buildResourceUrl(req, cita.id) }, 'Appointment created', 201);
  } catch (err) { next(err); }
};

export const updateCita = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cita = await appointmentService.updateCita(req.params['id'] as string, req.body);
    if (!cita) { errorResponse(res, 'Appointment not found', 404); return; }
    successResponse(res, cita, 'Appointment updated');
  } catch (err) { next(err); }
};

export const updateCitaStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cita = await appointmentService.updateCitaStatus(req.params['id'] as string, req.body);
    if (!cita) { errorResponse(res, 'Appointment not found', 404); return; }
    successResponse(res, cita, 'Appointment status updated');
  } catch (err) { next(err); }
};

export const deleteCita = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await appointmentService.deleteCita(req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Appointment not found', 404); return; }
    successResponse(res, null, 'Appointment cancelled');
  } catch (err) { next(err); }
};

export const getConfirmaciones = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const confirmaciones = await appointmentService.getConfirmaciones(req.params['citaId'] as string);
    successResponse(res, confirmaciones);
  } catch (err) { next(err); }
};

export const createConfirmacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const confirmacion = await appointmentService.createConfirmacion(req.params['citaId'] as string, req.body);
    successResponse(
      res,
      { id: confirmacion.id, url: buildResourceUrl(req, confirmacion.id) },
      'Confirmation created',
      201
    );
  } catch (err) { next(err); }
};
