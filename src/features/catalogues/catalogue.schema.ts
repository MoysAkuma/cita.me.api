import { z } from 'zod';

export const createCategoriaProveedorSchema = z.object({
  nombre: z.string().min(1).max(255),
  descripcion: z.string().optional(),
  iconUrl: z.string().url().optional(),
  esProfesionista: z.boolean().default(false),
});

export const updateCategoriaProveedorSchema = createCategoriaProveedorSchema.partial();

export const createCategoriaServicioSchema = z.object({
  nombre: z.string().min(1).max(255),
  descripcion: z.string().optional(),
  iconUrl: z.string().url().optional(),
});

export const updateCategoriaServicioSchema = createCategoriaServicioSchema.partial();

export const createStatusSchema = z.object({
  text: z.string().min(1).max(255),
  habilitado: z.boolean().default(true),
});

export const createCiudadSchema = z.object({
  name: z.string().min(1).max(255),
});

export const createEstadoSchema = z.object({
  name: z.string().min(1).max(255),
});

export type CreateCategoriaProveedorInput = z.infer<typeof createCategoriaProveedorSchema>;
export type UpdateCategoriaProveedorInput = z.infer<typeof updateCategoriaProveedorSchema>;
export type CreateCategoriaServicioInput = z.infer<typeof createCategoriaServicioSchema>;
export type UpdateCategoriaServicioInput = z.infer<typeof updateCategoriaServicioSchema>;
export type CreateStatusInput = z.infer<typeof createStatusSchema>;
export type CreateCiudadInput = z.infer<typeof createCiudadSchema>;
export type CreateEstadoInput = z.infer<typeof createEstadoSchema>;