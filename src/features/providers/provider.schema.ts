import { z } from 'zod';

export const createProviderSchema = z.object({
  categoria: z.number().int().positive(),
  nombreLegal: z.string().min(1).max(255),
  nombreComercial: z.string().min(1).max(255),
  rfc: z.string().max(20).optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.number().int().optional(),
  estado: z.number().int().optional(),
  pais: z.number().int().optional(),
});

export const updateProviderSchema = createProviderSchema.partial();

export const createSucursalSchema = z.object({
  nombre: z.string().min(1).max(255),
  direccion: z.string().optional(),
  numeroInterior: z.string().max(50).optional(),
  numeroExterior: z.string().max(50).optional(),
  codigoPostal: z.string().max(20).optional(),
  ciudad: z.string().max(100).optional(),
  estado: z.string().max(100).optional(),
  pais: z.string().max(100).optional(),
});

export const updateSucursalSchema = createSucursalSchema.partial();

export const createEmpleadoSchema = z.object({
  userId: z.string().uuid(),
  sucursalId: z.string().uuid().optional(),
  nombre: z.string().min(1).max(255),
});

export const createServicioSchema = z.object({
  name: z.string().min(1).max(255),
  duration: z.number().int().positive(),
  descripcion: z.string().optional(),
  precio: z.number().positive(),
});

export const updateServicioSchema = createServicioSchema.partial();

export const createHorarioSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  horaApertura: z.string(),
  horaCierre: z.string(),
  horaInicio: z.string(),
});

export const updateHorarioSchema = createHorarioSchema.partial();

export const createDocumentacionSchema = z.object({
  category: z.number().int().positive(),
  tipo: z.string().min(1).max(255),
});

export type CreateProviderInput = z.infer<typeof createProviderSchema>;
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>;
export type CreateSucursalInput = z.infer<typeof createSucursalSchema>;
export type UpdateSucursalInput = z.infer<typeof updateSucursalSchema>;
export type CreateEmpleadoInput = z.infer<typeof createEmpleadoSchema>;
export type CreateServicioInput = z.infer<typeof createServicioSchema>;
export type UpdateServicioInput = z.infer<typeof updateServicioSchema>;
export type CreateHorarioInput = z.infer<typeof createHorarioSchema>;
export type UpdateHorarioInput = z.infer<typeof updateHorarioSchema>;
export type CreateDocumentacionInput = z.infer<typeof createDocumentacionSchema>;
