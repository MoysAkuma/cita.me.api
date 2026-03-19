import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createProviderSchema, updateProviderSchema,
  createSucursalSchema, updateSucursalSchema,
  createEmpleadoSchema, createServicioSchema, updateServicioSchema,
  createHorarioSchema, updateHorarioSchema, createDocumentacionSchema,
} from './provider.schema';
import * as providerController from './provider.controller';

const router = Router();

// Proveedores
router.get('/', authenticate, providerController.getProveedores);
router.get('/:id', authenticate, providerController.getProveedorById);
router.post('/', authenticate, validate({ body: createProviderSchema }), providerController.createProveedor);
router.put('/:id', authenticate, validate({ body: updateProviderSchema }), providerController.updateProveedor);
router.delete('/:id', authenticate, providerController.deleteProveedor);

// Sucursales
router.get('/:proveedorId/sucursales', authenticate, providerController.getSucursales);
router.get('/:proveedorId/sucursales/:id', authenticate, providerController.getSucursalById);
router.post('/:proveedorId/sucursales', authenticate, validate({ body: createSucursalSchema }), providerController.createSucursal);
router.put('/:proveedorId/sucursales/:id', authenticate, validate({ body: updateSucursalSchema }), providerController.updateSucursal);
router.delete('/:proveedorId/sucursales/:id', authenticate, providerController.deleteSucursal);

// Empleados
router.get('/:proveedorId/empleados', authenticate, providerController.getEmpleados);
router.post('/:proveedorId/empleados', authenticate, validate({ body: createEmpleadoSchema }), providerController.createEmpleado);
router.delete('/:proveedorId/empleados/:id', authenticate, providerController.deleteEmpleado);

// Servicios
router.get('/:proveedorId/servicios', authenticate, providerController.getServicios);
router.post('/:proveedorId/servicios', authenticate, validate({ body: createServicioSchema }), providerController.createServicio);
router.put('/:proveedorId/servicios/:id', authenticate, validate({ body: updateServicioSchema }), providerController.updateServicio);
router.delete('/:proveedorId/servicios/:id', authenticate, providerController.deleteServicio);

// Horarios
router.get('/:proveedorId/horarios', authenticate, providerController.getHorarios);
router.post('/:proveedorId/horarios', authenticate, validate({ body: createHorarioSchema }), providerController.createHorario);
router.put('/:proveedorId/horarios/:id', authenticate, validate({ body: updateHorarioSchema }), providerController.updateHorario);
router.delete('/:proveedorId/horarios/:id', authenticate, providerController.deleteHorario);

// Documentacion
router.get('/:proveedorId/documentacion', authenticate, providerController.getDocumentacion);
router.post('/:proveedorId/documentacion', authenticate, validate({ body: createDocumentacionSchema }), providerController.createDocumentacion);
router.delete('/:proveedorId/documentacion/:id', authenticate, providerController.deleteDocumentacion);

export default router;
