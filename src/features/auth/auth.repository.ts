import { pool } from '../../config/database';
import { RegisterInput, LoginInput } from './auth.schema';

export const insertUsuario = async (
  input: RegisterInput,
  hashedPassword: string
) => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, correo, contraseña, telefono, telefono_whatsapp, fecha_nacimiento, sexo, acerca_de_mi)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, nombre, apellido, correo, telefono, telefono_whatsapp, fecha_nacimiento, sexo, acerca_de_mi, profile_photo_url`,
    [
      input.nombre,
      input.apellido,
      input.correo,
      hashedPassword,
      input.telefono ?? null,
      input.telefonoWhatsapp ?? null,
      input.fechaNacimiento ?? null,
      input.sexo ?? null,
      input.acercaDeMi ?? null,
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
