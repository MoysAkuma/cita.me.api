import { Request, Response, NextFunction } from 'express';
import * as providerService from './provider.service';
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response';

const buildResourceUrl = (req: Request, id: string | number): string => {
  const basePath = req.originalUrl.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}${basePath}/${id}`;
};

// ---- Proveedores ----
export const getProveedores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const filters = {
      categoria: req.query['categoria'] ? parseInt(req.query['categoria'] as string) : undefined,
      ciudad: req.query['ciudad'] ? parseInt(req.query['ciudad'] as string) : undefined,
      estado: req.query['estado'] ? parseInt(req.query['estado'] as string) : undefined,
    };
    const { proveedores, total } = await providerService.getProveedores(page, limit, filters);
    paginatedResponse(res, proveedores, total, page, limit);
  } catch (err) { next(err); }
};

export const getProveedorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const proveedor = await providerService.getProveedorById(req.params['id'] as string);
    if (!proveedor) { errorResponse(res, 'Provider not found', 404); return; }
    successResponse(res, proveedor);
  } catch (err) { next(err); }
};

export const createProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const proveedor = await providerService.createProveedor(userId, req.body);
    successResponse(res, { id: proveedor.id, url: buildResourceUrl(req, proveedor.id) }, 'Provider created', 201);
  } catch (err) { next(err); }
};

export const updateProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const proveedor = await providerService.updateProveedor(req.params['id'] as string, req.body);
    if (!proveedor) { errorResponse(res, 'Provider not found', 404); return; }
    successResponse(res, proveedor, 'Provider updated');
  } catch (err) { next(err); }
};

export const deleteProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteProveedor(req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Provider not found', 404); return; }
    successResponse(res, null, 'Provider deleted');
  } catch (err) { next(err); }
};

// ---- Sucursales ----
export const getSucursales = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sucursales = await providerService.getSucursales(req.params['proveedorId'] as string);
    successResponse(res, sucursales);
  } catch (err) { next(err); }
};

export const getSucursalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sucursal = await providerService.getSucursalById(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!sucursal) { errorResponse(res, 'Branch not found', 404); return; }
    successResponse(res, sucursal);
  } catch (err) { next(err); }
};

export const createSucursal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sucursal = await providerService.createSucursal(req.user!.sub, req.params['proveedorId'] as string, req.body);
    successResponse(res, { id: sucursal.id, url: buildResourceUrl(req, sucursal.id) }, 'Branch created', 201);
  } catch (err) { next(err); }
};

export const updateSucursal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sucursal = await providerService.updateSucursal(req.params['proveedorId'] as string, req.params['id'] as string, req.body);
    if (!sucursal) { errorResponse(res, 'Branch not found', 404); return; }
    successResponse(res, sucursal, 'Branch updated');
  } catch (err) { next(err); }
};

export const deleteSucursal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteSucursal(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Branch not found', 404); return; }
    successResponse(res, null, 'Branch deleted');
  } catch (err) { next(err); }
};

// ---- Empleados ----
export const getEmpleados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const empleados = await providerService.getEmpleados(req.params['proveedorId'] as string);
    successResponse(res, empleados);
  } catch (err) { next(err); }
};

export const createEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const empleado = await providerService.createEmpleado(req.params['proveedorId'] as string, req.body);
    successResponse(res, { id: empleado.id, url: buildResourceUrl(req, empleado.id) }, 'Employee added', 201);
  } catch (err) { next(err); }
};

export const deleteEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteEmpleado(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Employee not found', 404); return; }
    successResponse(res, null, 'Employee removed');
  } catch (err) { next(err); }
};

// ---- Servicios ----
export const getServicios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servicios = await providerService.getServicios(req.params['proveedorId'] as string);
    successResponse(res, servicios);
  } catch (err) { next(err); }
};

export const createServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servicio = await providerService.createServicio(req.params['proveedorId'] as string, req.body);
    successResponse(res, { id: servicio.id, url: buildResourceUrl(req, servicio.id) }, 'Service created', 201);
  } catch (err) { next(err); }
};

export const updateServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const servicio = await providerService.updateServicio(req.params['proveedorId'] as string, req.params['id'] as string, req.body);
    if (!servicio) { errorResponse(res, 'Service not found', 404); return; }
    successResponse(res, servicio, 'Service updated');
  } catch (err) { next(err); }
};

export const deleteServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteServicio(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Service not found', 404); return; }
    successResponse(res, null, 'Service deleted');
  } catch (err) { next(err); }
};

// ---- Horarios ----
export const getHorarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const horarios = await providerService.getHorarios(req.params['proveedorId'] as string);
    successResponse(res, horarios);
  } catch (err) { next(err); }
};

export const createHorario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const horario = await providerService.createHorario(req.params['proveedorId'] as string, req.body);
    successResponse(res, { id: horario.id, url: buildResourceUrl(req, horario.id) }, 'Schedule created', 201);
  } catch (err) { next(err); }
};

export const updateHorario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const horario = await providerService.updateHorario(req.params['proveedorId'] as string, req.params['id'] as string, req.body);
    if (!horario) { errorResponse(res, 'Schedule not found', 404); return; }
    successResponse(res, horario, 'Schedule updated');
  } catch (err) { next(err); }
};

export const deleteHorario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteHorario(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Schedule not found', 404); return; }
    successResponse(res, null, 'Schedule deleted');
  } catch (err) { next(err); }
};

// ---- Documentacion ----
export const getDocumentacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const docs = await providerService.getDocumentacion(req.params['proveedorId'] as string);
    successResponse(res, docs);
  } catch (err) { next(err); }
};

export const createDocumentacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const doc = await providerService.createDocumentacion(req.params['proveedorId'] as string, req.body);
    successResponse(res, { id: doc.id, url: buildResourceUrl(req, doc.id) }, 'Document added', 201);
  } catch (err) { next(err); }
};

export const deleteDocumentacion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await providerService.deleteDocumentacion(req.params['proveedorId'] as string, req.params['id'] as string);
    if (!deleted) { errorResponse(res, 'Document not found', 404); return; }
    successResponse(res, null, 'Document removed');
  } catch (err) { next(err); }
};
