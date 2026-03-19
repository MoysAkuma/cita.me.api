import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { createAppointmentSchema, updateAppointmentSchema, updateStatusSchema, createConfirmacionSchema } from './appointment.schema';
import * as appointmentController from './appointment.controller';

const router = Router();

router.get('/', authenticate, appointmentController.getCitas);
router.get('/:id', authenticate, appointmentController.getCitaById);
router.post('/', authenticate, validate({ body: createAppointmentSchema }), appointmentController.createCita);
router.put('/:id', authenticate, validate({ body: updateAppointmentSchema }), appointmentController.updateCita);
router.patch('/:id/status', authenticate, validate({ body: updateStatusSchema }), appointmentController.updateCitaStatus);
router.delete('/:id', authenticate, appointmentController.deleteCita);
router.get('/:citaId/confirmaciones', authenticate, appointmentController.getConfirmaciones);
router.post('/:citaId/confirmaciones', authenticate, validate({ body: createConfirmacionSchema }), appointmentController.createConfirmacion);

export default router;
