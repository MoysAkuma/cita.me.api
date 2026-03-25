import { pool } from '../../config/database';
import { CreateAppointmentInput, UpdateAppointmentInput, UpdateStatusInput, CreateConfirmacionInput } from './appointment.schema';

export const findCitas = async (
  page: number,
  limit: number,
  filters: { usuarioId?: string; proveedorId?: string }
) => {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (filters.usuarioId) { conditions.push(`"usuarioID" = $${idx++}`); values.push(filters.usuarioId); }
  if (filters.proveedorId) { conditions.push(`"proveedorID" = $${idx++}`); values.push(filters.proveedorId); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM citas ${where}`, values);
  const total = parseInt(countRows[0].count, 10);

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM citas ${where} ORDER BY fecha_creacion DESC LIMIT $${idx++} OFFSET $${idx}`,
    values
  );
  return { citas: rows, total };
};

export const findCitaById = async (id: string) => {
  const { rows } = await pool.query('SELECT * FROM citas WHERE id = $1', [id]);
  return rows[0] ?? null;
};

export const insertCita = async (usuarioId: string, input: CreateAppointmentInput) => {
  const { rows } = await pool.query(
    `INSERT INTO citas ("usuarioID", "proveedorID", "servicioID", "sucursalID", nombre_solicitante, whatsapp_solicitante, correo_solicitante, fecha_solicitada, notas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [usuarioId, input.proveedorId, input.servicioId, input.sucursalId ?? null,
     input.nombreSolicitante, input.whatsappSolicitante, input.correoSolicitante, input.fechaSolicitada, input.notas ?? null]
  );
  return rows[0];
};

export const updateCitaById = async (id: string, input: UpdateAppointmentInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.proveedorId !== undefined) { fields.push(`"proveedorID" = $${idx++}`); values.push(input.proveedorId); }
  if (input.servicioId !== undefined) { fields.push(`"servicioID" = $${idx++}`); values.push(input.servicioId); }
  if (input.sucursalId !== undefined) { fields.push(`"sucursalID" = $${idx++}`); values.push(input.sucursalId); }
  if (input.nombreSolicitante !== undefined) { fields.push(`nombre_solicitante = $${idx++}`); values.push(input.nombreSolicitante); }
  if (input.whatsappSolicitante !== undefined) { fields.push(`whatsapp_solicitante = $${idx++}`); values.push(input.whatsappSolicitante); }
  if (input.correoSolicitante !== undefined) { fields.push(`correo_solicitante = $${idx++}`); values.push(input.correoSolicitante); }
  if (input.fechaSolicitada !== undefined) { fields.push(`fecha_solicitada = $${idx++}`); values.push(input.fechaSolicitada); }
  if (input.notas !== undefined) { fields.push(`notas = $${idx++}`); values.push(input.notas); }

  if (fields.length === 0) return findCitaById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE citas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const updateCitaStatusById = async (id: string, input: UpdateStatusInput) => {
  const { rows } = await pool.query(
    'UPDATE citas SET status = $1 WHERE id = $2 RETURNING *',
    [input.status, id]
  );
  return rows[0] ?? null;
};

export const deleteCitaById = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM citas WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

export const findConfirmaciones = async (citaId: string) => {
  const { rows } = await pool.query('SELECT * FROM confirmaciones WHERE cita_id = $1', [citaId]);
  return rows;
};

export const insertConfirmacion = async (citaId: string, input: CreateConfirmacionInput) => {
  const { rows } = await pool.query(
    `INSERT INTO confirmaciones (cita_id, usuario_id, proveedor_id, servicio_id, telefono_whatsapp)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [citaId, input.usuarioId, input.proveedorId, input.servicioId, input.telefonoWhatsapp]
  );
  return rows[0];
};
