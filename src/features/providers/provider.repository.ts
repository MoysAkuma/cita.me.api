import { pool } from '../../config/database';
import {
  CreateProviderInput, UpdateProviderInput,
  CreateSucursalInput, UpdateSucursalInput,
  CreateEmpleadoInput, CreateServicioInput, UpdateServicioInput,
  CreateHorarioInput, UpdateHorarioInput, CreateDocumentacionInput,
} from './provider.schema';

// ---- Proveedores ----
export const findProveedores = async (
  page: number,
  limit: number,
  filters: { categoria?: number; ciudad?: number; estado?: number }
) => {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (filters.categoria) { conditions.push(`categoria = $${idx++}`); values.push(filters.categoria); }
  if (filters.ciudad) { conditions.push(`ciudad = $${idx++}`); values.push(filters.ciudad); }
  if (filters.estado) { conditions.push(`estado = $${idx++}`); values.push(filters.estado); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows: countRows } = await pool.query(`SELECT COUNT(*) FROM proveedores ${where}`, values);
  const total = parseInt(countRows[0].count, 10);

  values.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM proveedores ${where} ORDER BY nombre_comercial ASC LIMIT $${idx++} OFFSET $${idx}`,
    values
  );
  return { proveedores: rows, total };
};

export const findProveedorById = async (id: string) => {
  const { rows } = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);
  return rows[0] ?? null;
};

export const insertProveedor = async (userId: string, input: CreateProviderInput) => {
  const { rows } = await pool.query(
    `INSERT INTO proveedores (user_id, categoria, nombre_legal, nombre_comercial, rfc, descripcion, direccion, ciudad, estado, pais)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [userId, input.categoria, input.nombreLegal, input.nombreComercial, input.rfc ?? null,
     input.descripcion ?? null, input.direccion ?? null, input.ciudad ?? null, input.estado ?? null, input.pais ?? null]
  );
  return rows[0];
};

export const updateProveedorById = async (id: string, input: UpdateProviderInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.categoria !== undefined) { fields.push(`categoria = $${idx++}`); values.push(input.categoria); }
  if (input.nombreLegal !== undefined) { fields.push(`nombre_legal = $${idx++}`); values.push(input.nombreLegal); }
  if (input.nombreComercial !== undefined) { fields.push(`nombre_comercial = $${idx++}`); values.push(input.nombreComercial); }
  if (input.rfc !== undefined) { fields.push(`rfc = $${idx++}`); values.push(input.rfc); }
  if (input.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(input.descripcion); }
  if (input.direccion !== undefined) { fields.push(`direccion = $${idx++}`); values.push(input.direccion); }
  if (input.ciudad !== undefined) { fields.push(`ciudad = $${idx++}`); values.push(input.ciudad); }
  if (input.estado !== undefined) { fields.push(`estado = $${idx++}`); values.push(input.estado); }
  if (input.pais !== undefined) { fields.push(`pais = $${idx++}`); values.push(input.pais); }

  if (fields.length === 0) return findProveedorById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE proveedores SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteProveedorById = async (id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM proveedores WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

// ---- Sucursales ----
export const findSucursales = async (proveedorId: string) => {
  const { rows } = await pool.query('SELECT * FROM sucursales WHERE proveedor_id = $1', [proveedorId]);
  return rows;
};

export const findSucursalById = async (proveedorId: string, id: string) => {
  const { rows } = await pool.query('SELECT * FROM sucursales WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return rows[0] ?? null;
};

export const insertSucursal = async (userId: string, proveedorId: string, input: CreateSucursalInput) => {
  const { rows } = await pool.query(
    `INSERT INTO sucursales (user_id, proveedor_id, nombre, direccion, numero_interior, numero_exterior, codigo_postal, ciudad, estado, pais)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [userId, proveedorId, input.nombre, input.direccion ?? null, input.numeroInterior ?? null,
     input.numeroExterior ?? null, input.codigoPostal ?? null, input.ciudad ?? null, input.estado ?? null, input.pais ?? null]
  );
  return rows[0];
};

export const updateSucursalById = async (proveedorId: string, id: string, input: UpdateSucursalInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.nombre !== undefined) { fields.push(`nombre = $${idx++}`); values.push(input.nombre); }
  if (input.direccion !== undefined) { fields.push(`direccion = $${idx++}`); values.push(input.direccion); }
  if (input.numeroInterior !== undefined) { fields.push(`numero_interior = $${idx++}`); values.push(input.numeroInterior); }
  if (input.numeroExterior !== undefined) { fields.push(`numero_exterior = $${idx++}`); values.push(input.numeroExterior); }
  if (input.codigoPostal !== undefined) { fields.push(`codigo_postal = $${idx++}`); values.push(input.codigoPostal); }
  if (input.ciudad !== undefined) { fields.push(`ciudad = $${idx++}`); values.push(input.ciudad); }
  if (input.estado !== undefined) { fields.push(`estado = $${idx++}`); values.push(input.estado); }
  if (input.pais !== undefined) { fields.push(`pais = $${idx++}`); values.push(input.pais); }

  if (fields.length === 0) return findSucursalById(proveedorId, id);

  values.push(id, proveedorId);
  const { rows } = await pool.query(
    `UPDATE sucursales SET ${fields.join(', ')} WHERE id = $${idx++} AND proveedor_id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteSucursalById = async (proveedorId: string, id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM sucursales WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return (rowCount ?? 0) > 0;
};

// ---- Empleados ----
export const findEmpleados = async (proveedorId: string) => {
  const { rows } = await pool.query('SELECT * FROM empleados WHERE proveedor_id = $1', [proveedorId]);
  return rows;
};

export const insertEmpleado = async (proveedorId: string, input: CreateEmpleadoInput) => {
  const { rows } = await pool.query(
    `INSERT INTO empleados (user_id, proveedor_id, sucursal_id, nombre)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.userId, proveedorId, input.sucursalId ?? null, input.nombre]
  );
  return rows[0];
};

export const deleteEmpleadoById = async (proveedorId: string, id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM empleados WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return (rowCount ?? 0) > 0;
};

// ---- Servicios ----
export const findServicios = async (proveedorId: string) => {
  const { rows } = await pool.query('SELECT * FROM servicios WHERE proveedor_id = $1', [proveedorId]);
  return rows;
};

export const insertServicio = async (proveedorId: string, input: CreateServicioInput) => {
  const { rows } = await pool.query(
    `INSERT INTO servicios (proveedor_id, name, duration, descripcion, precio)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [proveedorId, input.name, input.duration, input.descripcion ?? null, input.precio]
  );
  return rows[0];
};

export const updateServicioById = async (proveedorId: string, id: string, input: UpdateServicioInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.name !== undefined) { fields.push(`name = $${idx++}`); values.push(input.name); }
  if (input.duration !== undefined) { fields.push(`duration = $${idx++}`); values.push(input.duration); }
  if (input.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(input.descripcion); }
  if (input.precio !== undefined) { fields.push(`precio = $${idx++}`); values.push(input.precio); }

  if (fields.length === 0) {
    const { rows } = await pool.query('SELECT * FROM servicios WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
    return rows[0] ?? null;
  }

  values.push(id, proveedorId);
  const { rows } = await pool.query(
    `UPDATE servicios SET ${fields.join(', ')} WHERE id = $${idx++} AND proveedor_id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteServicioById = async (proveedorId: string, id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM servicios WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return (rowCount ?? 0) > 0;
};

// ---- Horarios ----
export const findHorarios = async (proveedorId: string) => {
  const { rows } = await pool.query('SELECT * FROM horarios WHERE proveedor_id = $1', [proveedorId]);
  return rows;
};

export const insertHorario = async (proveedorId: string, input: CreateHorarioInput) => {
  const { rows } = await pool.query(
    `INSERT INTO horarios (proveedor_id, dia_semana, hora_apertura, hora_cierre, hora_inicio)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [proveedorId, input.diaSemana, input.horaApertura, input.horaCierre, input.horaInicio]
  );
  return rows[0];
};

export const updateHorarioById = async (proveedorId: string, id: string, input: UpdateHorarioInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.diaSemana !== undefined) { fields.push(`dia_semana = $${idx++}`); values.push(input.diaSemana); }
  if (input.horaApertura !== undefined) { fields.push(`hora_apertura = $${idx++}`); values.push(input.horaApertura); }
  if (input.horaCierre !== undefined) { fields.push(`hora_cierre = $${idx++}`); values.push(input.horaCierre); }
  if (input.horaInicio !== undefined) { fields.push(`hora_inicio = $${idx++}`); values.push(input.horaInicio); }

  if (fields.length === 0) {
    const { rows } = await pool.query('SELECT * FROM horarios WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
    return rows[0] ?? null;
  }

  values.push(id, proveedorId);
  const { rows } = await pool.query(
    `UPDATE horarios SET ${fields.join(', ')} WHERE id = $${idx++} AND proveedor_id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteHorarioById = async (proveedorId: string, id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM horarios WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return (rowCount ?? 0) > 0;
};

// ---- Documentacion ----
export const findDocumentacion = async (proveedorId: string) => {
  const { rows } = await pool.query('SELECT * FROM documentacion WHERE proveedor_id = $1', [proveedorId]);
  return rows;
};

export const insertDocumentacion = async (proveedorId: string, input: CreateDocumentacionInput) => {
  const { rows } = await pool.query(
    `INSERT INTO documentacion (proveedor_id, category, tipo) VALUES ($1, $2, $3) RETURNING *`,
    [proveedorId, input.category, input.tipo]
  );
  return rows[0];
};

export const deleteDocumentacionById = async (proveedorId: string, id: string): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM documentacion WHERE id = $1 AND proveedor_id = $2', [id, proveedorId]);
  return (rowCount ?? 0) > 0;
};
