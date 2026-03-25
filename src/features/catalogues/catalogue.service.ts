import {
  CreateCategoriaProveedorInput, UpdateCategoriaProveedorInput,
  CreateCategoriaServicioInput, UpdateCategoriaServicioInput,
  CreateStatusInput,
} from './catalogue.schema';
import * as catalogueRepository from './catalogue.repository';

// CategoriasProveedores
export const getCategoriasProveedores = async () => {
  return catalogueRepository.findCategoriasProveedores();
};

export const getCategoriaProveedorById = async (id: number) => {
  return catalogueRepository.findCategoriaProveedorById(id);
};

export const createCategoriaProveedor = async (input: CreateCategoriaProveedorInput) => {
  return catalogueRepository.insertCategoriaProveedor(input);
};

export const updateCategoriaProveedor = async (id: number, input: UpdateCategoriaProveedorInput) => {
  return catalogueRepository.updateCategoriaProveedorById(id, input);
};

export const deleteCategoriaProveedor = async (id: number): Promise<boolean> => {
  return catalogueRepository.deleteCategoriaProveedorById(id);
};

// CategoriasServicios
export const getCategoriasServicios = async () => {
  return catalogueRepository.findCategoriasServicios();
};

export const getCategoriaServicioById = async (id: number) => {
  return catalogueRepository.findCategoriaServicioById(id);
};

export const createCategoriaServicio = async (input: CreateCategoriaServicioInput) => {
  return catalogueRepository.insertCategoriaServicio(input);
};

export const updateCategoriaServicio = async (id: number, input: UpdateCategoriaServicioInput) => {
  return catalogueRepository.updateCategoriaServicioById(id, input);
};

export const deleteCategoriaServicio = async (id: number): Promise<boolean> => {
  return catalogueRepository.deleteCategoriaServicioById(id);
};

// Ciudades
export const getCiudades = async () => {
  return catalogueRepository.findCiudades();
};

// Estados
export const getEstados = async () => {
  return catalogueRepository.findEstados();
};

// Status Catalogo
export const getStatusCatalogo = async () => {
  return catalogueRepository.findStatusCatalogo();
};

export const createStatus = async (input: CreateStatusInput) => {
  return catalogueRepository.insertStatus(input);
};
