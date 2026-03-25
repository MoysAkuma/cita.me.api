import { pool } from '../../config/database';
import { UpdateUserInput, UpdatePhotoInput } from './user.schema';

export const findAllUsers = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const { rows: countRows } = await pool.query('SELECT COUNT(*) FROM usuarios');
  const total = parseInt(countRows[0].count, 10);

  const { rows } = await pool.query(
    `SELECT id, nombre, apellido, acerca_de_mi, correo, telefono, telefono_whatsapp,
            fecha_nacimiento, sexo, profile_photo_url
     FROM usuarios ORDER BY nombre ASC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return { users: rows, total };
};

export const findUserById = async (id: string) => {
  const { rows } = await pool.query(
    `SELECT id, nombre, apellido, acerca_de_mi, correo, telefono, telefono_whatsapp,
            fecha_nacimiento, sexo, profile_photo_url
     FROM usuarios WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};

export const updateUserById = async (id: string, input: UpdateUserInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.nombre !== undefined) { fields.push(`nombre = $${idx++}`); values.push(input.nombre); }
  if (input.apellido !== undefined) { fields.push(`apellido = $${idx++}`); values.push(input.apellido); }
  if (input.acercaDeMi !== undefined) { fields.push(`acerca_de_mi = $${idx++}`); values.push(input.acercaDeMi); }
  if (input.telefono !== undefined) { fields.push(`telefono = $${idx++}`); values.push(input.telefono); }
  if (input.telefonoWhatsapp !== undefined) { fields.push(`telefono_whatsapp = $${idx++}`); values.push(input.telefonoWhatsapp); }
  if (input.fechaNacimiento !== undefined) { fields.push(`fecha_nacimiento = $${idx++}`); values.push(input.fechaNacimiento); }
  if (input.sexo !== undefined) { fields.push(`sexo = $${idx++}`); values.push(input.sexo); }

  if (fields.length === 0) return findUserById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx}
     RETURNING id, nombre, apellido, acerca_de_mi, correo, telefono, telefono_whatsapp, fecha_nacimiento, sexo, profile_photo_url`,
    values
  );
  return rows[0] ?? null;
};

export const deleteUserById = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

export const updateProfilePhotoById = async (id: string, input: UpdatePhotoInput) => {
  const { rows } = await pool.query(
    `UPDATE usuarios SET profile_photo_url = $1 WHERE id = $2
     RETURNING id, nombre, apellido, correo, profile_photo_url`,
    [input.profilePhotoUrl, id]
  );
  return rows[0] ?? null;
};
