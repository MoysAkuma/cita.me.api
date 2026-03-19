import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(1).max(100),
  apellido: z.string().min(1).max(100),
  correo: z.string().email(),
  contraseña: z.string().min(8),
  telefono: z.string().optional(),
  telefonoWhatsapp: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  sexo: z.string().optional(),
  acercaDeMi: z.string().optional(),
});

export const loginSchema = z.object({
  correo: z.string().email(),
  contraseña: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
