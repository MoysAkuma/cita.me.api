import { z } from 'zod';

export const updateUserSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  apellido: z.string().min(1).max(100).optional(),
  acercaDeMi: z.string().optional(),
  telefono: z.string().optional(),
  telefonoWhatsapp: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  sexo: z.string().optional(),
});

export const updatePhotoSchema = z.object({
  profilePhotoUrl: z.string().url(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
