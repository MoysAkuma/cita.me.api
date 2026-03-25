import { Request, Response, NextFunction } from 'express';
import * as catalogueService from './catalogue.service';
import { successResponse, errorResponse } from '../../utils/response';

const buildResourceUrl = (req: Request, id: string | number): string => {
  const basePath = req.originalUrl.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}${basePath}/${id}`;
};

export const getCategoriasProveedores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getCategoriasProveedores();
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const getCategoriaProveedorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getCategoriaProveedorById(parseInt(req.params['id'] as string));
    if (!data) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const createCategoriaProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.createCategoriaProveedor(req.body);
    successResponse(res, { id: data.id, url: buildResourceUrl(req, data.id) }, 'Category created', 201);
  } catch (err) { next(err); }
};

export const updateCategoriaProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.updateCategoriaProveedor(parseInt(req.params['id'] as string), req.body);
    if (!data) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, data, 'Category updated');
  } catch (err) { next(err); }
};

export const deleteCategoriaProveedor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await catalogueService.deleteCategoriaProveedor(parseInt(req.params['id'] as string));
    if (!deleted) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

export const getCategoriasServicios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getCategoriasServicios();
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const getCategoriaServicioById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getCategoriaServicioById(parseInt(req.params['id'] as string));
    if (!data) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const createCategoriaServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.createCategoriaServicio(req.body);
    successResponse(res, { id: data.id, url: buildResourceUrl(req, data.id) }, 'Category created', 201);
  } catch (err) { next(err); }
};

export const updateCategoriaServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.updateCategoriaServicio(parseInt(req.params['id'] as string), req.body);
    if (!data) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, data, 'Category updated');
  } catch (err) { next(err); }
};

export const deleteCategoriaServicio = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await catalogueService.deleteCategoriaServicio(parseInt(req.params['id'] as string));
    if (!deleted) { errorResponse(res, 'Category not found', 404); return; }
    successResponse(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

export const getCiudades = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getCiudades();
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const getEstados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getEstados();
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const getStatusCatalogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.getStatusCatalogo();
    successResponse(res, data);
  } catch (err) { next(err); }
};

export const createStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await catalogueService.createStatus(req.body);
    successResponse(res, { id: data.id, url: buildResourceUrl(req, data.id) }, 'Status created', 201);
  } catch (err) { next(err); }
};
