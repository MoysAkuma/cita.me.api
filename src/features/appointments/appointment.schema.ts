import { z } from 'zod';

export const createAppointmentSchema = z.object({
  proveedor_id: z.string().uuid(),
  servicio_id: z.number().int().positive(),
  fecha_solicitada: z.string(),
  hora_solicitada: z.string(),
  sucursal_id: z.number().int().positive().optional(),
  user_id: z.string().uuid().optional(),
  nombre_solicitante: z.string().max(100),
  whatsapp_solicitante: z.string().max(20),
  correo_solicitante: z.string().email().max(100),
  notas: z.string().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export const updateStatusSchema = z.object({
  status: z.number().int().positive(),
});

export const createConfirmacionSchema = z.object({
  usuarioId: z.string().uuid(),
  proveedorId: z.string().uuid(),
  servicioId: z.string().uuid(),
  telefonoWhatsapp: z.string(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type CreateConfirmacionInput = z.infer<typeof createConfirmacionSchema>;
