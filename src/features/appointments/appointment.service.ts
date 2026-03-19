import { pool } from '../../config/database';
import { CreateAppointmentInput, UpdateAppointmentInput, UpdateStatusInput, CreateConfirmacionInput } from './appointment.schema';

export const getCitas = async (page: number, limit: number, filters: { usuarioId?: string; proveedorId?: string }) => {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (filters.usuarioId) { conditions.push(`usuario_id = $${idx++}`); values.push(filters.usuarioId); }
  if (filters.proveedorId) { conditions.push(`proveedor_id = $${idx++}`); values.push(filters.proveedorId); }

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

export const getCitaById = async (id: string) => {
  const { rows } = await pool.query('SELECT * FROM citas WHERE id = $1', [id]);
  return rows[0] ?? null;
};

export const createCita = async (usuarioId: string, input: CreateAppointmentInput) => {
  const { rows } = await pool.query(
    `INSERT INTO citas (usuario_id, proveedor_id, servicio_id, sucursal_id, fecha_solicitada, hora_solicitada, hora_finalizacion_deseada, notas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [usuarioId, input.proveedorId, input.servicioId, input.sucursalId ?? null,
     input.fechaSolicitada, input.horaSolicitada, input.horaFinalizacionDeseada ?? null, input.notas ?? null]
  );
  return rows[0];
};

export const updateCita = async (id: string, input: UpdateAppointmentInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.proveedorId !== undefined) { fields.push(`proveedor_id = $${idx++}`); values.push(input.proveedorId); }
  if (input.servicioId !== undefined) { fields.push(`servicio_id = $${idx++}`); values.push(input.servicioId); }
  if (input.sucursalId !== undefined) { fields.push(`sucursal_id = $${idx++}`); values.push(input.sucursalId); }
  if (input.fechaSolicitada !== undefined) { fields.push(`fecha_solicitada = $${idx++}`); values.push(input.fechaSolicitada); }
  if (input.horaSolicitada !== undefined) { fields.push(`hora_solicitada = $${idx++}`); values.push(input.horaSolicitada); }
  if (input.horaFinalizacionDeseada !== undefined) { fields.push(`hora_finalizacion_deseada = $${idx++}`); values.push(input.horaFinalizacionDeseada); }
  if (input.notas !== undefined) { fields.push(`notas = $${idx++}`); values.push(input.notas); }

  if (fields.length === 0) return getCitaById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE citas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const updateCitaStatus = async (id: string, input: UpdateStatusInput) => {
  const { rows } = await pool.query(
    'UPDATE citas SET status = $1 WHERE id = $2 RETURNING *',
    [input.status, id]
  );
  return rows[0] ?? null;
};

export const deleteCita = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM citas WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

export const getConfirmaciones = async (citaId: string) => {
  const { rows } = await pool.query('SELECT * FROM confirmaciones WHERE cita_id = $1', [citaId]);
  return rows;
};

export const createConfirmacion = async (citaId: string, input: CreateConfirmacionInput) => {
  const { rows } = await pool.query(
    `INSERT INTO confirmaciones (cita_id, usuario_id, proveedor_id, servicio_id, telefono_whatsapp)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [citaId, input.usuarioId, input.proveedorId, input.servicioId, input.telefonoWhatsapp]
  );
  return rows[0];
};
