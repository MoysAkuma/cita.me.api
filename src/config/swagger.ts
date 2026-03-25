import { Options } from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Cita.me API',
    version: '1.0.0',
    description: 'API REST para la plataforma de agendamiento de citas Cita.me',
    contact: {
      name: 'Cita.me Team',
    },
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Desarrollo local' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtenido en /auth/login',
      },
    },
    schemas: {
      // ── Generic ─────────────────────────────────────────────────────────
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Mensaje de error' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 50 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
        },
      },
      // ── Auth ─────────────────────────────────────────────────────────────
      RegisterInput: {
        type: 'object',
        required: ['nombre', 'apellido', 'correo', 'contraseña'],
        properties: {
          nombre: { type: 'string', minLength: 1, maxLength: 100, example: 'Juan' },
          apellido: { type: 'string', minLength: 1, maxLength: 100, example: 'Pérez' },
          correo: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          contraseña: { type: 'string', minLength: 8, example: 'S3cr3t0!' },
          telefono: { type: 'string', example: '5512345678' },
          telefonoWhatsapp: { type: 'string', example: '5512345678' },
          fechaNacimiento: { type: 'string', example: '1990-05-15' },
          sexo: { type: 'string', example: 'M' },
          acercaDeMi: { type: 'string', example: 'Médico general con 10 años de experiencia' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['correo', 'contraseña'],
        properties: {
          correo: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          contraseña: { type: 'string', example: 'S3cr3t0!' },
        },
      },
      RefreshTokenInput: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9...' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/User' },
              accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9...' },
              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9...' },
            },
          },
        },
      },
      // ── User ─────────────────────────────────────────────────────────────
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          correo: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          telefono: { type: 'string', nullable: true, example: '5512345678' },
          telefonoWhatsapp: { type: 'string', nullable: true, example: '5512345678' },
          fechaNacimiento: { type: 'string', nullable: true, example: '1990-05-15' },
          sexo: { type: 'string', nullable: true, example: 'M' },
          acercaDeMi: { type: 'string', nullable: true, example: 'Médico general' },
          profilePhotoUrl: { type: 'string', nullable: true, example: 'https://cdn.ejemplo.com/foto.jpg' },
        },
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          nombre: { type: 'string', minLength: 1, maxLength: 100, example: 'Juan' },
          apellido: { type: 'string', minLength: 1, maxLength: 100, example: 'Pérez' },
          acercaDeMi: { type: 'string', example: 'Texto actualizado' },
          telefono: { type: 'string', example: '5512345678' },
          telefonoWhatsapp: { type: 'string', example: '5512345678' },
          fechaNacimiento: { type: 'string', example: '1990-05-15' },
          sexo: { type: 'string', example: 'F' },
        },
      },
      UpdatePhotoInput: {
        type: 'object',
        required: ['profilePhotoUrl'],
        properties: {
          profilePhotoUrl: { type: 'string', format: 'uri', example: 'https://cdn.ejemplo.com/foto.jpg' },
        },
      },
      // ── Provider ─────────────────────────────────────────────────────────
      Proveedor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          categoria: { type: 'integer', example: 1 },
          nombreLegal: { type: 'string', example: 'Clínica San José S.A.' },
          nombreComercial: { type: 'string', example: 'Clínica San José' },
          rfc: { type: 'string', nullable: true, example: 'CSJ900101ABC' },
          descripcion: { type: 'string', nullable: true },
          direccion: { type: 'string', nullable: true },
          ciudad: { type: 'integer', nullable: true },
          estado: { type: 'integer', nullable: true },
          pais: { type: 'integer', nullable: true },
        },
      },
      CreateProveedorInput: {
        type: 'object',
        required: ['categoria', 'nombreLegal', 'nombreComercial'],
        properties: {
          categoria: { type: 'integer', example: 1 },
          nombreLegal: { type: 'string', maxLength: 255, example: 'Clínica San José S.A.' },
          nombreComercial: { type: 'string', maxLength: 255, example: 'Clínica San José' },
          rfc: { type: 'string', maxLength: 20, example: 'CSJ900101ABC' },
          descripcion: { type: 'string', example: 'Clínica de medicina general' },
          direccion: { type: 'string', example: 'Av. Insurgentes 123' },
          ciudad: { type: 'integer', example: 1 },
          estado: { type: 'integer', example: 9 },
          pais: { type: 'integer', example: 1 },
        },
      },
      UpdateProveedorInput: {
        allOf: [{ $ref: '#/components/schemas/CreateProveedorInput' }],
        description: 'Todos los campos son opcionales en la actualización',
      },
      // ── Sucursal ─────────────────────────────────────────────────────────
      Sucursal: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          nombre: { type: 'string', example: 'Sucursal Centro' },
          direccion: { type: 'string', nullable: true },
          numeroInterior: { type: 'string', nullable: true },
          numeroExterior: { type: 'string', nullable: true },
          codigoPostal: { type: 'string', nullable: true },
          ciudad: { type: 'string', nullable: true },
          estado: { type: 'string', nullable: true },
          pais: { type: 'string', nullable: true },
        },
      },
      CreateSucursalInput: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', maxLength: 255, example: 'Sucursal Centro' },
          direccion: { type: 'string', example: 'Av. Reforma 50' },
          numeroInterior: { type: 'string', maxLength: 50, example: 'Piso 3' },
          numeroExterior: { type: 'string', maxLength: 50, example: '50' },
          codigoPostal: { type: 'string', maxLength: 20, example: '06600' },
          ciudad: { type: 'string', maxLength: 100, example: 'Ciudad de México' },
          estado: { type: 'string', maxLength: 100, example: 'CDMX' },
          pais: { type: 'string', maxLength: 100, example: 'México' },
        },
      },
      // ── Empleado ─────────────────────────────────────────────────────────
      Empleado: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          sucursalId: { type: 'string', format: 'uuid', nullable: true },
          nombre: { type: 'string', example: 'Dr. Carlos Méndez' },
        },
      },
      CreateEmpleadoInput: {
        type: 'object',
        required: ['userId', 'nombre'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
          sucursalId: { type: 'string', format: 'uuid' },
          nombre: { type: 'string', maxLength: 255, example: 'Dr. Carlos Méndez' },
        },
      },
      // ── Servicio ─────────────────────────────────────────────────────────
      Servicio: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Consulta general' },
          duration: { type: 'integer', example: 30, description: 'Duración en minutos' },
          descripcion: { type: 'string', nullable: true },
          precio: { type: 'number', example: 350.00 },
        },
      },
      CreateServicioInput: {
        type: 'object',
        required: ['name', 'duration', 'precio'],
        properties: {
          name: { type: 'string', maxLength: 255, example: 'Consulta general' },
          duration: { type: 'integer', minimum: 1, example: 30 },
          descripcion: { type: 'string', example: 'Consulta médica de primer nivel' },
          precio: { type: 'number', minimum: 0.01, example: 350.00 },
        },
      },
      // ── Horario ─────────────────────────────────────────────────────────
      Horario: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          diaSemana: { type: 'integer', minimum: 0, maximum: 6, example: 1, description: '0=Domingo, 1=Lunes, ..., 6=Sábado' },
          horaApertura: { type: 'string', example: '09:00' },
          horaCierre: { type: 'string', example: '18:00' },
          horaInicio: { type: 'string', example: '09:00' },
        },
      },
      CreateHorarioInput: {
        type: 'object',
        required: ['diaSemana', 'horaApertura', 'horaCierre', 'horaInicio'],
        properties: {
          diaSemana: { type: 'integer', minimum: 0, maximum: 6, example: 1 },
          horaApertura: { type: 'string', example: '09:00' },
          horaCierre: { type: 'string', example: '18:00' },
          horaInicio: { type: 'string', example: '09:00' },
        },
      },
      // ── Documentacion ────────────────────────────────────────────────────
      Documentacion: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          category: { type: 'integer', example: 1 },
          tipo: { type: 'string', example: 'Cédula profesional' },
        },
      },
      CreateDocumentacionInput: {
        type: 'object',
        required: ['category', 'tipo'],
        properties: {
          category: { type: 'integer', minimum: 1, example: 1 },
          tipo: { type: 'string', maxLength: 255, example: 'Cédula profesional' },
        },
      },
      // ── Appointment ──────────────────────────────────────────────────────
      Cita: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          usuarioId: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          servicioId: { type: 'integer', example: 1 },
          sucursalId: { type: 'integer', nullable: true, example: 1 },
          nombreSolicitante: { type: 'string', maxLength: 100, example: 'Juan Pérez' },
          whatsappSolicitante: { type: 'string', maxLength: 20, example: '5512345678' },
          correoSolicitante: { type: 'string', maxLength: 100, example: 'juan.perez@email.com' },
          fechaSolicitada: { type: 'string', format: 'date', example: '2026-04-01' },
          notas: { type: 'string', nullable: true },
          status: { type: 'integer', example: 1 },
          calificacion: { type: 'integer', nullable: true, minimum: 1, maximum: 5, example: 5 },
          fechaCreacion: { type: 'string', format: 'date-time' },
        },
      },
      CreateCitaInput: {
        type: 'object',
        required: ['proveedorId', 'servicioId', 'nombreSolicitante', 'whatsappSolicitante', 'correoSolicitante', 'fechaSolicitada'],
        properties: {
          proveedorId: { type: 'string', format: 'uuid' },
          servicioId: { type: 'integer', minimum: 1, example: 1 },
          sucursalId: { type: 'integer', minimum: 1, example: 1 },
          nombreSolicitante: { type: 'string', maxLength: 100, example: 'Juan Pérez' },
          whatsappSolicitante: { type: 'string', maxLength: 20, example: '5512345678' },
          correoSolicitante: { type: 'string', format: 'email', maxLength: 100, example: 'juan.perez@email.com' },
          fechaSolicitada: { type: 'string', format: 'date', example: '2026-04-01' },
          notas: { type: 'string', example: 'Traer estudios previos' },
        },
      },
      UpdateStatusInput: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      Confirmacion: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          citaId: { type: 'string', format: 'uuid' },
          usuarioId: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          servicioId: { type: 'string', format: 'uuid' },
          telefonoWhatsapp: { type: 'string', example: '5512345678' },
        },
      },
      CreateConfirmacionInput: {
        type: 'object',
        required: ['usuarioId', 'proveedorId', 'servicioId', 'telefonoWhatsapp'],
        properties: {
          usuarioId: { type: 'string', format: 'uuid' },
          proveedorId: { type: 'string', format: 'uuid' },
          servicioId: { type: 'string', format: 'uuid' },
          telefonoWhatsapp: { type: 'string', example: '5512345678' },
        },
      },
      // ── Catalogues ───────────────────────────────────────────────────────
      CategoriaProveedor: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Médicos' },
          descripcion: { type: 'string', nullable: true },
          iconUrl: { type: 'string', nullable: true, example: 'https://cdn.ejemplo.com/icon.svg' },
          esProfesionista: { type: 'boolean', example: true },
        },
      },
      CreateCategoriaProveedorInput: {
        type: 'object',
        required: ['nombre', 'esProfesionista'],
        properties: {
          nombre: { type: 'string', maxLength: 255, example: 'Médicos' },
          descripcion: { type: 'string', example: 'Servicios médicos generales y especializados' },
          iconUrl: { type: 'string', format: 'uri', example: 'https://cdn.ejemplo.com/icon.svg' },
          esProfesionista: { type: 'boolean', default: false },
        },
      },
      CategoriaServicio: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Consulta general' },
          descripcion: { type: 'string', nullable: true },
          iconUrl: { type: 'string', nullable: true },
        },
      },
      CreateCategoriaServicioInput: {
        type: 'object',
        required: ['nombre'],
        properties: {
          nombre: { type: 'string', maxLength: 255, example: 'Consulta general' },
          descripcion: { type: 'string', example: 'Consultas médicas de primer nivel' },
          iconUrl: { type: 'string', format: 'uri', example: 'https://cdn.ejemplo.com/icon.svg' },
        },
      },
      Ciudad: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ciudad de México' },
        },
      },
      Estado: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 9 },
          name: { type: 'string', example: 'Ciudad de México' },
        },
      },
      StatusCatalogo: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          text: { type: 'string', example: 'Pendiente' },
          habilitado: { type: 'boolean', example: true },
        },
      },
      CreateStatusInput: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', maxLength: 255, example: 'Pendiente' },
          habilitado: { type: 'boolean', default: true },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'No autenticado – se requiere token JWT',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { success: false, message: 'Unauthorized' },
          },
        },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { success: false, message: 'Not found' },
          },
        },
      },
      ValidationError: {
        description: 'Error de validación en el cuerpo de la solicitud',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { success: false, message: 'Validation error', errors: [] },
          },
        },
      },
    },
    parameters: {
      PageParam: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', default: 1 },
        description: 'Número de página',
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', default: 20, maximum: 100 },
        description: 'Elementos por página',
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registro, inicio de sesión y tokens' },
    { name: 'Usuarios', description: 'Gestión de usuarios' },
    { name: 'Proveedores', description: 'Gestión de proveedores de servicios' },
    { name: 'Sucursales', description: 'Sucursales de un proveedor' },
    { name: 'Empleados', description: 'Empleados de un proveedor' },
    { name: 'Servicios', description: 'Servicios ofrecidos por un proveedor' },
    { name: 'Horarios', description: 'Horarios de atención de un proveedor' },
    { name: 'Documentación', description: 'Documentos de un proveedor' },
    { name: 'Citas', description: 'Gestión de citas' },
    { name: 'Confirmaciones', description: 'Confirmaciones de citas' },
    { name: 'Catálogos', description: 'Catálogos del sistema (ciudades, estados, categorías)' },
  ],
  paths: {
    // ── Health ────────────────────────────────────────────────────────────
    '/health': {
      get: {
        summary: 'Estado del servidor',
        tags: ['Auth'],
        responses: {
          200: { description: 'Servidor en línea', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } } },
        },
      },
    },
    // ── Auth ──────────────────────────────────────────────────────────────
    '/auth/register': {
      post: {
        summary: 'Registrar nuevo usuario',
        tags: ['Auth'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
        responses: {
          201: { description: 'Usuario registrado exitosamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { description: 'Correo ya registrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión',
        tags: ['Auth'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: {
          200: { description: 'Sesión iniciada exitosamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Cerrar sesión (invalida el access token)',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Sesión cerrada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Logged out' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Renovar access token usando refresh token',
        tags: ['Auth'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenInput' } } } },
        responses: {
          200: {
            description: 'Nuevo access token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object', properties: { accessToken: { type: 'string' } } },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { description: 'Refresh token inválido o expirado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    // ── Users ─────────────────────────────────────────────────────────────
    '/user': {
      get: {
        summary: 'Listar usuarios (paginado)',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
        ],
        responses: {
          200: {
            description: 'Lista de usuarios',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/user/{id}': {
      get: {
        summary: 'Obtener usuario por ID',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Usuario encontrado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/User' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar usuario',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserInput' } } } },
        responses: {
          200: { description: 'Usuario actualizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/User' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar usuario',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Usuario eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/user/{id}/photo': {
      patch: {
        summary: 'Actualizar foto de perfil',
        tags: ['Usuarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePhotoInput' } } } },
        responses: {
          200: { description: 'Foto actualizada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/User' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Proveedores ───────────────────────────────────────────────────────
    '/proveedores': {
      get: {
        summary: 'Listar proveedores (paginado y filtrado)',
        tags: ['Proveedores'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { name: 'categoria', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por categoría' },
          { name: 'ciudad', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por ciudad' },
          { name: 'estado', in: 'query', schema: { type: 'integer' }, description: 'Filtrar por estado' },
        ],
        responses: {
          200: {
            description: 'Lista de proveedores',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Proveedor' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear proveedor',
        tags: ['Proveedores'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProveedorInput' } } } },
        responses: {
          201: { description: 'Proveedor creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Proveedor' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{id}': {
      get: {
        summary: 'Obtener proveedor por ID',
        tags: ['Proveedores'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Proveedor encontrado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Proveedor' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar proveedor',
        tags: ['Proveedores'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProveedorInput' } } } },
        responses: {
          200: { description: 'Proveedor actualizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Proveedor' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar proveedor',
        tags: ['Proveedores'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Proveedor eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Sucursales ────────────────────────────────────────────────────────
    '/proveedores/{proveedorId}/sucursales': {
      get: {
        summary: 'Listar sucursales de un proveedor',
        tags: ['Sucursales'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de sucursales', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Sucursal' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear sucursal',
        tags: ['Sucursales'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSucursalInput' } } } },
        responses: {
          201: { description: 'Sucursal creada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Sucursal' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{proveedorId}/sucursales/{id}': {
      get: {
        summary: 'Obtener sucursal por ID',
        tags: ['Sucursales'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Sucursal encontrada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Sucursal' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar sucursal',
        tags: ['Sucursales'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSucursalInput' } } } },
        responses: {
          200: { description: 'Sucursal actualizada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Sucursal' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar sucursal',
        tags: ['Sucursales'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Sucursal eliminada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Empleados ─────────────────────────────────────────────────────────
    '/proveedores/{proveedorId}/empleados': {
      get: {
        summary: 'Listar empleados de un proveedor',
        tags: ['Empleados'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de empleados', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Empleado' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Agregar empleado a un proveedor',
        tags: ['Empleados'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateEmpleadoInput' } } } },
        responses: {
          201: { description: 'Empleado creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Empleado' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{proveedorId}/empleados/{id}': {
      delete: {
        summary: 'Eliminar empleado',
        tags: ['Empleados'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Empleado eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Servicios ─────────────────────────────────────────────────────────
    '/proveedores/{proveedorId}/servicios': {
      get: {
        summary: 'Listar servicios de un proveedor',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de servicios', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Servicio' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateServicioInput' } } } },
        responses: {
          201: { description: 'Servicio creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Servicio' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{proveedorId}/servicios/{id}': {
      put: {
        summary: 'Actualizar servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateServicioInput' } } } },
        responses: {
          200: { description: 'Servicio actualizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Servicio' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar servicio',
        tags: ['Servicios'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Servicio eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Horarios ─────────────────────────────────────────────────────────
    '/proveedores/{proveedorId}/horarios': {
      get: {
        summary: 'Listar horarios de un proveedor',
        tags: ['Horarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de horarios', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Horario' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear horario',
        tags: ['Horarios'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateHorarioInput' } } } },
        responses: {
          201: { description: 'Horario creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Horario' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{proveedorId}/horarios/{id}': {
      put: {
        summary: 'Actualizar horario',
        tags: ['Horarios'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateHorarioInput' } } } },
        responses: {
          200: { description: 'Horario actualizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Horario' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar horario',
        tags: ['Horarios'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Horario eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Documentacion ────────────────────────────────────────────────────
    '/proveedores/{proveedorId}/documentacion': {
      get: {
        summary: 'Listar documentación de un proveedor',
        tags: ['Documentación'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de documentos', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Documentacion' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Agregar documento',
        tags: ['Documentación'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateDocumentacionInput' } } } },
        responses: {
          201: { description: 'Documento creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Documentacion' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/proveedores/{proveedorId}/documentacion/{id}': {
      delete: {
        summary: 'Eliminar documento',
        tags: ['Documentación'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'proveedorId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Documento eliminado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Citas ──────────────────────────────────────────────────────────────
    '/citas': {
      get: {
        summary: 'Listar citas (paginado y filtrado)',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/PageParam' },
          { $ref: '#/components/parameters/LimitParam' },
          { name: 'usuarioId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filtrar por usuario' },
          { name: 'proveedorId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filtrar por proveedor' },
        ],
        responses: {
          200: {
            description: 'Lista de citas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Cita' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCitaInput' } } } },
        responses: {
          201: { description: 'Cita creada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Cita' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/citas/{id}': {
      get: {
        summary: 'Obtener cita por ID',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Cita encontrada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Cita' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCitaInput' } } } },
        responses: {
          200: { description: 'Cita actualizada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Cita' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Cita eliminada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/citas/{id}/status': {
      patch: {
        summary: 'Actualizar estado de una cita',
        tags: ['Citas'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateStatusInput' } } } },
        responses: {
          200: { description: 'Estado actualizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Cita' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    // ── Confirmaciones ────────────────────────────────────────────────────
    '/citas/{citaId}/confirmaciones': {
      get: {
        summary: 'Listar confirmaciones de una cita',
        tags: ['Confirmaciones'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'citaId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de confirmaciones', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Confirmacion' } } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        summary: 'Crear confirmación de cita',
        tags: ['Confirmaciones'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'citaId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateConfirmacionInput' } } } },
        responses: {
          201: { description: 'Confirmación creada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/Confirmacion' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    // ── Catalogues ────────────────────────────────────────────────────────
    '/catalogues/categorias-proveedores': {
      get: {
        summary: 'Listar categorías de proveedores',
        tags: ['Catálogos'],
        responses: {
          200: { description: 'Lista de categorías', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/CategoriaProveedor' } } } } } } },
        },
      },
      post: {
        summary: 'Crear categoría de proveedor',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoriaProveedorInput' } } } },
        responses: {
          201: { description: 'Categoría creada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaProveedor' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/catalogues/categorias-proveedores/{id}': {
      get: {
        summary: 'Obtener categoría de proveedor por ID',
        tags: ['Catálogos'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoría encontrada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaProveedor' } } } } } },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar categoría de proveedor',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoriaProveedorInput' } } } },
        responses: {
          200: { description: 'Categoría actualizada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaProveedor' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar categoría de proveedor',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoría eliminada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/catalogues/categorias-servicios': {
      get: {
        summary: 'Listar categorías de servicios',
        tags: ['Catálogos'],
        responses: {
          200: { description: 'Lista de categorías', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/CategoriaServicio' } } } } } } },
        },
      },
      post: {
        summary: 'Crear categoría de servicio',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoriaServicioInput' } } } },
        responses: {
          201: { description: 'Categoría creada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaServicio' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/catalogues/categorias-servicios/{id}': {
      get: {
        summary: 'Obtener categoría de servicio por ID',
        tags: ['Catálogos'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoría encontrada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaServicio' } } } } } },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        summary: 'Actualizar categoría de servicio',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateCategoriaServicioInput' } } } },
        responses: {
          200: { description: 'Categoría actualizada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/CategoriaServicio' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        summary: 'Eliminar categoría de servicio',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Categoría eliminada', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string', example: 'Deleted' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/catalogues/ciudades': {
      get: {
        summary: 'Listar ciudades',
        tags: ['Catálogos'],
        responses: {
          200: { description: 'Lista de ciudades', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Ciudad' } } } } } } },
        },
      },
    },
    '/catalogues/estados': {
      get: {
        summary: 'Listar estados',
        tags: ['Catálogos'],
        responses: {
          200: { description: 'Lista de estados', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/Estado' } } } } } } },
        },
      },
    },
    '/catalogues/status': {
      get: {
        summary: 'Listar estados de cita habilitados',
        tags: ['Catálogos'],
        responses: {
          200: { description: 'Lista de estados de cita', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { type: 'array', items: { $ref: '#/components/schemas/StatusCatalogo' } } } } } } },
        },
      },
      post: {
        summary: 'Crear estado de cita',
        tags: ['Catálogos'],
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateStatusInput' } } } },
        responses: {
          201: { description: 'Estado creado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean', example: true }, data: { $ref: '#/components/schemas/StatusCatalogo' } } } } } },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
  },
};

export const swaggerOptions: Options = {
  definition: swaggerDefinition,
  apis: [],
};

export { swaggerDefinition };
