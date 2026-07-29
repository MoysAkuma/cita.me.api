import {
  CreateProviderInput, UpdateProviderInput,
  CreateSucursalInput, UpdateSucursalInput,
  CreateEmpleadoInput, CreateServicioInput, UpdateServicioInput,
  CreateHorarioInput, UpdateHorarioInput, CreateDocumentacionInput,
  CreateOnboardingInput
} from './provider.schema';
import * as providerRepository from './provider.repository';

// ---- Onboarding ----
export const onboarding = async (userId: string, input: CreateOnboardingInput) => {
   //Guardar el proveedor en la base de datos
  const provider = await providerRepository.insertProveedor(userId, input);
  console.log('Proveedor creado:', provider);
  if (!provider) {
    throw new Error('Error al crear el proveedor');
  }
  //Guardar los servicios en la base de datos
  if (input.servicios) {
    for (const servicio of input.servicios) {
      await providerRepository.insertServicio(provider.id, {
        name: servicio.nombre,
        duration: servicio.duracion,
        descripcion: servicio.descripcion,
        precio: servicio.precio,
      });
      console.log('Servicio creado:', servicio.nombre);
    }
  }

  //Guardar los horarios en la base de datos
  if (input.horarios) {
    for (const horario of input.horarios) {
      await providerRepository.insertHorario(provider.id, {
        dia_semana: horario.dia_semana,
        hora_apertura: horario.hora_apertura,
        hora_cierre: horario.hora_cierre
      });
    }
  }

};
// ---- Proveedores ----
export const getProveedores = async (page: number, limit: number, filters: { categoria?: number; ciudad?: number; estado?: number }) => {
  return providerRepository.findProveedores(page, limit, filters);
};

export const getProveedorById = async (id: string) => {
  return providerRepository.findProveedorById(id);
};

export const createProveedor = async (userId: string, input: CreateProviderInput): Promise<{ id: string }> => {
  const proveedor = await providerRepository.insertProveedor(userId, {
    nombre_comercial: input.nombre_comercial,
    categoria: input.categoria,
    descripcion: input.descripcion,
    ciudad: input.ubicacion.ciudad,
    estado: input.ubicacion.estado,
    direccion: input.ubicacion.direccion,
    codigo_postal: input.ubicacion.codigo_postal,
    telefono: input.contacto.telefono,
    whatsapp: input.contacto.whatsapp,
    email: input.contacto.email,
    datos_legales: {
      razon_social: input.nombre_legal,
      representante_legal: undefined,
      rfc: input.rfc,
    },
  });

  return { id: String(proveedor.id) };
};

export const updateProveedor = async (id: string, input: UpdateProviderInput) => {
  return providerRepository.updateProveedorById(id, input);
};

export const deleteProveedor = async (id: string): Promise<boolean> => {
  return providerRepository.deleteProveedorById(id);
};

// ---- Sucursales ----
export const getSucursales = async (proveedorId: string) => {
  return providerRepository.findSucursales(proveedorId);
};

export const getSucursalById = async (proveedorId: string, id: string) => {
  return providerRepository.findSucursalById(proveedorId, id);
};

export const createSucursal = async (userId: string, proveedorId: string, input: CreateSucursalInput) => {
  return providerRepository.insertSucursal(userId, proveedorId, input);
};

export const updateSucursal = async (proveedorId: string, id: string, input: UpdateSucursalInput) => {
  return providerRepository.updateSucursalById(proveedorId, id, input);
};

export const deleteSucursal = async (proveedorId: string, id: string): Promise<boolean> => {
  return providerRepository.deleteSucursalById(proveedorId, id);
};

// ---- Empleados ----
export const getEmpleados = async (proveedorId: string) => {
  return providerRepository.findEmpleados(proveedorId);
};

export const createEmpleado = async (proveedorId: string, input: CreateEmpleadoInput) => {
  return providerRepository.insertEmpleado(proveedorId, input);
};

export const deleteEmpleado = async (proveedorId: string, id: string): Promise<boolean> => {
  return providerRepository.deleteEmpleadoById(proveedorId, id);
};

// ---- Servicios ----
export const getServicios = async (proveedorId: string) => {
  return providerRepository.findServicios(proveedorId);
};

export const createServicio = async (proveedorId: string, input: CreateServicioInput) => {
  return providerRepository.insertServicio(proveedorId, input);
};

export const updateServicio = async (proveedorId: string, id: string, input: UpdateServicioInput) => {
  return providerRepository.updateServicioById(proveedorId, id, input);
};

export const deleteServicio = async (proveedorId: string, id: string): Promise<boolean> => {
  return providerRepository.deleteServicioById(proveedorId, id);
};

// ---- Horarios ----
export const getHorarios = async (proveedorId: string) => {
  return providerRepository.findHorarios(proveedorId);
};

export const createHorario = async (proveedorId: string, input: CreateHorarioInput) => {
  return providerRepository.insertHorario(proveedorId, input);
};

export const updateHorario = async (proveedorId: string, id: string, input: UpdateHorarioInput) => {
  return providerRepository.updateHorarioById(proveedorId, id, input);
};

export const deleteHorario = async (proveedorId: string, id: string): Promise<boolean> => {
  return providerRepository.deleteHorarioById(proveedorId, id);
};

// ---- Documentacion ----
export const getDocumentacion = async (proveedorId: string) => {
  return providerRepository.findDocumentacion(proveedorId);
};

export const createDocumentacion = async (proveedorId: string, input: CreateDocumentacionInput) => {
  return providerRepository.insertDocumentacion(proveedorId, input);
};

export const deleteDocumentacion = async (proveedorId: string, id: string): Promise<boolean> => {
  return providerRepository.deleteDocumentacionById(proveedorId, id);
};
