import { pool } from '../../config/database';
import { RegisterInput, LoginInput } from './auth.schema';

export const insertUsuario = async (
  input: RegisterInput,
  hashedPassword: string
) => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contraseña, telefono, telefono_whatsapp, fecha_nacimiento, sexo, acerca_de_mi, profile_photo_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, telefono, telefono_whatsapp, fecha_nacimiento, sexo, acerca_de_mi, profile_photo_url`,
    [
      input.nombre,
      input.segundo_nombre,
      input.apellido_paterno,
      input.apellido_materno,
      input.correo,
      hashedPassword,
      input.telefono ?? null,
      input.telefono_whatsapp ?? null,
      input.fecha_nacimiento ?? null,
      input.sexo ?? null,
      input.acerca_de_mi ?? null,
      input.profile_photo_url ?? null,
    ]
  );
  return rows[0];
};

export const findUsuarioByCorreo = async (correo: string) => {
  const { rows } = await pool.query(
    'SELECT * FROM usuarios WHERE correo = $1',
    [correo]
  );
  return rows[0] ?? null;
};

export const insertLogLogin = async (correo: string) => {
  await pool.query(
    'INSERT INTO log_login (message) VALUES ($1)',
    [`User ${correo} logged in at ${new Date().toISOString()}`]
  );
};
