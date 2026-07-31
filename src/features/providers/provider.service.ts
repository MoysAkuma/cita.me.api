import {
  CreateProviderInput, UpdateProviderInput,
  CreateSucursalInput, UpdateSucursalInput,
  CreateEmpleadoInput, CreateServicioInput, UpdateServicioInput,
  CreateHorarioInput, UpdateHorarioInput, CreateDocumentacionInput,
  CreateOnboardingInput
} from './provider.schema';
import * as providerRepository from './provider.repository';

type ProviderCatalogueReference = {
  id: number | null;
  name: string | null;
};

type ProviderWithCatalogueNames = {
  id: string;
  user_id?: string | null;
  categoria?: number | null;
  categoria_nombre?: string | null;
  ciudad?: number | null;
  ciudad_nombre?: string | null;
  estado?: number | null;
  estado_nombre?: string | null;
  nombre_legal?: string | null;
  rfc?: string | null;
  telefono_whatsapp?: string | null;
  [key: string]: unknown;
};

const buildCatalogueReference = (id?: number | null, name?: string | null): ProviderCatalogueReference | null => {
  if (id == null && !name) {
    return null;
  }

  return {
    id: id ?? null,
    name: name ?? null,
  };
};

const providerServiceFields = 'id, name, duration,descripcion, precio, rating, es_destacado, orden';
const providerScheduleFields = 'dia_semana, hora_apertura, hora_cierre, disponibilidad';

const enrichProviderData = async (provider: ProviderWithCatalogueNames) => {
  const [servicios, horario] = await Promise.all([
    providerRepository.findServicios(provider.id, providerServiceFields),
    providerRepository.findHorarios(provider.id, providerScheduleFields),
  ]);

  return mapProviderCatalogueData({ ...provider, servicios, horario });
};

const enrichProvidersData = async (providers: ProviderWithCatalogueNames[]) => {
  return Promise.all(providers.map((provider) => enrichProviderData(provider)));
};

const mapProviderCatalogueData = (provider: ProviderWithCatalogueNames) => {
  const {
    user_id,
    categoria,
    categoria_nombre,
    ciudad,
    ciudad_nombre,
    estado,
    estado_nombre,
    nombre_legal,
    rfc,
    telefono_whatsapp,
    ...rest
  } = provider;

  return {
    ...rest,
    adminId: user_id ?? null,
    whatsapp: telefono_whatsapp ?? null,
    datos_legales: {
      razon_social: nombre_legal ?? null,
      representante_legal: null,
      rfc: rfc ?? null,
    },
    categoria: buildCatalogueReference(categoria, categoria_nombre),
    ciudad: buildCatalogueReference(ciudad, ciudad_nombre),
    estado: buildCatalogueReference(estado, estado_nombre),
  };
};

// ---- Onboarding ----
export const onboarding = async (userId: string, input: CreateOnboardingInput): Promise<{ id: string }> => {
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

  return { id: String(provider.id) };

};
// ---- Proveedores ----
export const getProveedores = async (page: number, limit: number, filters: { categoria?: number; ciudad?: number; estado?: number }) => {
  const proveedores = await providerRepository.findProveedores(page, limit, filters);
  const mappedProveedores = await enrichProvidersData(proveedores.proveedores as ProviderWithCatalogueNames[]);

  return { ...proveedores, proveedores: mappedProveedores };
};

export const getProveedorById = async (id: string) => {
  const provider = await providerRepository.findProveedorById(id);
  if (!provider) {
    return null;
  }

  return enrichProviderData(provider as ProviderWithCatalogueNames);
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
