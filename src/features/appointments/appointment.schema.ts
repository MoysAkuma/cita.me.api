import { z } from 'zod';

export const createAppointmentSchema = z.object({
  proveedorId: z.string().uuid(),
  servicioId: z.number().int().positive(),
  sucursalId: z.number().int().positive().optional(),
  nombreSolicitante: z.string().max(100),
  whatsappSolicitante: z.string().max(20),
  correoSolicitante: z.string().email().max(100),
  fechaSolicitada: z.string(),
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
