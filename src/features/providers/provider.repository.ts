import { pool } from '../../config/database';
import {
  CreateProviderInput, UpdateProviderInput,
  CreateSucursalInput, UpdateSucursalInput,
  CreateEmpleadoInput, CreateServicioInput, UpdateServicioInput,
  CreateHorarioInput, UpdateHorarioInput, CreateDocumentacionInput,
} from './provider.schema';
import type { CreateOnboardingInput } from './provider.schema';

// ---- Proveedores ----
export const findProveedores = async (
  page: number,
  limit: number,
  filters: { categoria?: number; ciudad?: number; estado?: number },
  fields: string = '*'
) => {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (filters.categoria) { conditions.push(`p.categoria = $${idx++}`); values.push(filters.categoria); }
  if (filters.ciudad) { conditions.push(`p.ciudad = $${idx++}`); values.push(filters.ciudad); }
  if (filters.estado) { conditions.push(`p.estado = $${idx++}`); values.push(filters.estado); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const fromAndJoins = `
    FROM proveedores p
    LEFT JOIN categorias_proveedores cp ON cp.id = p.categoria
    LEFT JOIN ciudades c ON c.id = p.ciudad
    LEFT JOIN estados e ON e.id = p.estado
  `;

  const { rows: countRows } = await pool.query(`SELECT COUNT(*) ${fromAndJoins} ${where}`, values);
  const total = parseInt(countRows[0].count, 10);

  const selectedFields = fields === '*' ? 'p.*' : fields;

  values.push(limit, offset);
  const { rows } = await pool.query(
    `
      SELECT
        ${selectedFields},
        cp.nombre AS categoria_nombre,
        c.name AS ciudad_nombre,
        e.name AS estado_nombre
      ${fromAndJoins}
      ${where}
      ORDER BY p.nombre_comercial ASC
      LIMIT $${idx++}
      OFFSET $${idx}
    `,
    values
  );
  return { proveedores: rows, total };
};

export const findProveedorById = async (id: string) => {
  const { rows } = await pool.query(
    `
      SELECT
        p.*,
        cp.nombre AS categoria_nombre,
        c.name AS ciudad_nombre,
        e.name AS estado_nombre
      FROM proveedores p
      LEFT JOIN categorias_proveedores cp ON cp.id = p.categoria
      LEFT JOIN ciudades c ON c.id = p.ciudad
      LEFT JOIN estados e ON e.id = p.estado
      WHERE p.id = $1
    `,
    [id]
  );
  return rows[0] ?? null;
};

export const insertProveedor = async (userId: string, input: CreateOnboardingInput) => {
  const { rows } = await pool.query(
    `INSERT INTO proveedores (user_id, categoria, nombre_legal, nombre_comercial, rfc, descripcion, direccion, ciudad, estado, pais, rating, codigo_postal, telefono, telefono_whatsapp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
    [
      userId, 
      input.categoria, 
      input.datos_legales.razon_social ?? null, 
      input.nombre_comercial,
      input.datos_legales.rfc ?? null,
      input.descripcion ?? null, 
      input.direccion ?? null, 
      input.ciudad ?? null, 
      input.estado ?? null,
      1,'5.0',
      input.codigo_postal ?? null,
      input.telefono ?? null,
      input.whatsapp ?? null
    ]
  );
  return rows[0];
};

export const updateProveedorById = async (id: string, input: UpdateProviderInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.categoria !== undefined) { fields.push(`categoria = $${idx++}`); values.push(input.categoria); }
  if (input.nombre_legal !== undefined) { fields.push(`nombre_legal = $${idx++}`); values.push(input.nombre_legal); }
  if (input.nombre_comercial !== undefined) { fields.push(`nombre_comercial = $${idx++}`); values.push(input.nombre_comercial); }
  if (input.rfc !== undefined) { fields.push(`rfc = $${idx++}`); values.push(input.rfc); }
  if (input.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(input.descripcion); }
  if (input.ubicacion?.direccion !== undefined) { fields.push(`direccion = $${idx++}`); values.push(input.ubicacion.direccion); }
  if (input.ubicacion?.ciudad !== undefined) { fields.push(`ciudad = $${idx++}`); values.push(input.ubicacion.ciudad); }
  if (input.ubicacion?.estado !== undefined) { fields.push(`estado = $${idx++}`); values.push(input.ubicacion.estado); }

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
export const findServicios = async (proveedorId: string, fields: string = '*') => {
  const { rows } = await pool.query(`SELECT ${fields} FROM servicios WHERE proveedor_id = $1`, [proveedorId]);
  return rows;
};

export const insertServicio = async (proveedorId: string, input: CreateServicioInput) => {
  const { rows } = await pool.query(
    `INSERT INTO servicios (proveedor_id, categoria_id, name, duration, descripcion, precio, rating, es_destacado, orden)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [proveedorId, null, input.name, input.duration, input.descripcion ?? null, input.precio, "1", false, 0]
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
export const findHorarios = async (proveedorId: string, fields: string = '*') => {
  const { rows } = await pool.query(`SELECT ${fields} FROM horarios WHERE proveedor_id = $1`, [proveedorId]);
  return rows;
};

export const insertHorario = async (proveedorId: string, input: CreateHorarioInput) => {
  const { rows } = await pool.query(
    `INSERT INTO horarios (proveedor_id, dia_semana, hora_apertura, hora_cierre, status, disponibilidad)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [proveedorId, input.dia_semana, 
      input.hora_apertura, 
      input.hora_cierre, true, '']
  );
  return rows[0];
};

export const updateHorarioById = async (proveedorId: string, id: string, input: UpdateHorarioInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.dia_semana !== undefined) { fields.push(`dia_semana = $${idx++}`); values.push(input.dia_semana); }
  if (input.hora_apertura !== undefined) { fields.push(`hora_apertura = $${idx++}`); values.push(input.hora_apertura); }
  if (input.hora_cierre !== undefined) { fields.push(`hora_cierre = $${idx++}`); values.push(input.hora_cierre); }
  if (input.status !== undefined) { fields.push(`status = $${idx++}`); values.push(input.status); }
  if (input.disponibilidad !== undefined) { fields.push(`disponibilidad = $${idx++}`); values.push(input.disponibilidad); }

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
