import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createCategoriaProveedorSchema, updateCategoriaProveedorSchema,
  createCategoriaServicioSchema, updateCategoriaServicioSchema,
  createStatusSchema,
} from './catalogue.schema';
import * as catalogueController from './catalogue.controller';

const router = Router();

router.get('/categorias-proveedores', catalogueController.getCategoriasProveedores);
router.get('/categorias-proveedores/:id', catalogueController.getCategoriaProveedorById);
router.post('/categorias-proveedores', authenticate, validate({ body: createCategoriaProveedorSchema }), catalogueController.createCategoriaProveedor);
router.put('/categorias-proveedores/:id', authenticate, validate({ body: updateCategoriaProveedorSchema }), catalogueController.updateCategoriaProveedor);
router.delete('/categorias-proveedores/:id', authenticate, catalogueController.deleteCategoriaProveedor);

router.get('/categorias-servicios', catalogueController.getCategoriasServicios);
router.get('/categorias-servicios/:id', catalogueController.getCategoriaServicioById);
router.post('/categorias-servicios', authenticate, validate({ body: createCategoriaServicioSchema }), catalogueController.createCategoriaServicio);
router.put('/categorias-servicios/:id', authenticate, validate({ body: updateCategoriaServicioSchema }), catalogueController.updateCategoriaServicio);
router.delete('/categorias-servicios/:id', authenticate, catalogueController.deleteCategoriaServicio);

router.get('/ciudades', catalogueController.getCiudades);
router.get('/estados', catalogueController.getEstados);

router.get('/status', catalogueController.getStatusCatalogo);
router.post('/status', authenticate, validate({ body: createStatusSchema }), catalogueController.createStatus);

export default router;
