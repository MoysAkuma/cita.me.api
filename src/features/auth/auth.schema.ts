import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(1).max(100),
  segundo_nombre: z.string().min(1).max(100),
  apellido_paterno: z.string().min(1).max(100),
  apellido_materno: z.string().min(1).max(100),
  acerca_de_mi: z.string().optional(),
  correo: z.string().email(),
  contraseña: z.string().min(8),
  telefono: z.string().optional(),
  telefono_whatsapp: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  sexo: z.string().optional(),
  profile_photo_url: z.string().optional(),
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
