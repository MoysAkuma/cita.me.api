import { pool } from '../../config/database';
import {
  CreateCategoriaProveedorInput, UpdateCategoriaProveedorInput,
  CreateCategoriaServicioInput, UpdateCategoriaServicioInput,
  CreateStatusInput,
} from './catalogue.schema';

// CategoriasProveedores
export const findCategoriasProveedores = async () => {
  const { rows } = await pool.query('SELECT * FROM categorias_proveedores ORDER BY nombre ASC');
  return rows;
};

export const findCategoriaProveedorById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM categorias_proveedores WHERE id = $1', [id]);
  return rows[0] ?? null;
};

export const insertCategoriaProveedor = async (input: CreateCategoriaProveedorInput) => {
  const { rows } = await pool.query(
    `INSERT INTO categorias_proveedores (nombre, descripcion, icon_url, es_profesionista)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.nombre, input.descripcion ?? null, input.iconUrl ?? null, input.esProfesionista]
  );
  return rows[0];
};

export const updateCategoriaProveedorById = async (id: number, input: UpdateCategoriaProveedorInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.nombre !== undefined) { fields.push(`nombre = $${idx++}`); values.push(input.nombre); }
  if (input.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(input.descripcion); }
  if (input.iconUrl !== undefined) { fields.push(`icon_url = $${idx++}`); values.push(input.iconUrl); }
  if (input.esProfesionista !== undefined) { fields.push(`es_profesionista = $${idx++}`); values.push(input.esProfesionista); }

  if (fields.length === 0) return findCategoriaProveedorById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE categorias_proveedores SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteCategoriaProveedorById = async (id: number): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM categorias_proveedores WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

// CategoriasServicios
export const findCategoriasServicios = async () => {
  const { rows } = await pool.query('SELECT * FROM categorias_servicios ORDER BY nombre ASC');
  return rows;
};

export const findCategoriaServicioById = async (id: number) => {
  const { rows } = await pool.query('SELECT * FROM categorias_servicios WHERE id = $1', [id]);
  return rows[0] ?? null;
};

export const insertCategoriaServicio = async (input: CreateCategoriaServicioInput) => {
  const { rows } = await pool.query(
    `INSERT INTO categorias_servicios (nombre, descripcion, icon_url) VALUES ($1, $2, $3) RETURNING *`,
    [input.nombre, input.descripcion ?? null, input.iconUrl ?? null]
  );
  return rows[0];
};

export const updateCategoriaServicioById = async (id: number, input: UpdateCategoriaServicioInput) => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (input.nombre !== undefined) { fields.push(`nombre = $${idx++}`); values.push(input.nombre); }
  if (input.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(input.descripcion); }
  if (input.iconUrl !== undefined) { fields.push(`icon_url = $${idx++}`); values.push(input.iconUrl); }

  if (fields.length === 0) return findCategoriaServicioById(id);

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE categorias_servicios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows[0] ?? null;
};

export const deleteCategoriaServicioById = async (id: number): Promise<boolean> => {
  const { rowCount } = await pool.query('DELETE FROM categorias_servicios WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
};

// Ciudades
export const findCiudades = async () => {
  const { rows } = await pool.query('SELECT * FROM ciudades ORDER BY name ASC');
  return rows;
};

// Estados
export const findEstados = async () => {
  const { rows } = await pool.query('SELECT * FROM estados ORDER BY name ASC');
  return rows;
};

// Status Catalogo
export const findStatusCatalogo = async () => {
  const { rows } = await pool.query('SELECT * FROM status_catalogo WHERE habilitado = true ORDER BY id ASC');
  return rows;
};

export const insertStatus = async (input: CreateStatusInput) => {
  const { rows } = await pool.query(
    'INSERT INTO status_catalogo (text, habilitado) VALUES ($1, $2) RETURNING *',
    [input.text, input.habilitado]
  );
  return rows[0];
};
