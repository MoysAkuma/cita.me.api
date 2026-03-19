-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Catalogues first (no dependencies)
CREATE TABLE IF NOT EXISTS categorias_proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icon_url VARCHAR(500),
    es_profesionista BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS categorias_servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icon_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS ciudades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS status_catalogo (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    habilitado BOOLEAN NOT NULL DEFAULT TRUE
);

-- Users
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    acerca_de_mi TEXT,
    correo VARCHAR(255) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    telefono_whatsapp VARCHAR(30),
    fecha_nacimiento DATE,
    sexo VARCHAR(20),
    profile_photo_url VARCHAR(500)
);

-- Providers
CREATE TABLE IF NOT EXISTS proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria INT REFERENCES categorias_proveedores(id),
    nombre_legal VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    descripcion TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    direccion TEXT,
    ciudad INT,
    estado INT,
    pais INT
);

CREATE INDEX IF NOT EXISTS idx_proveedores_user_id ON proveedores(user_id);
CREATE INDEX IF NOT EXISTS idx_proveedores_categoria ON proveedores(categoria);

CREATE TABLE IF NOT EXISTS sucursales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES usuarios(id),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT,
    numero_interior VARCHAR(50),
    numero_exterior VARCHAR(50),
    codigo_postal VARCHAR(20),
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_sucursales_proveedor_id ON sucursales(proveedor_id);

CREATE TABLE IF NOT EXISTS empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES usuarios(id),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    sucursal_id UUID REFERENCES sucursales(id),
    nombre VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_empleados_proveedor_id ON empleados(proveedor_id);

CREATE TABLE IF NOT EXISTS servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    descripcion TEXT,
    precio FLOAT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_servicios_proveedor_id ON servicios(proveedor_id);

CREATE TABLE IF NOT EXISTS horarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    dia_semana INT NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,
    hora_inicio TIME NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_horarios_proveedor_id ON horarios(proveedor_id);

CREATE TABLE IF NOT EXISTS documentacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
    category INT REFERENCES categorias_proveedores(id),
    tipo VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documentacion_proveedor_id ON documentacion(proveedor_id);

-- Appointments
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id),
    servicio_id UUID NOT NULL REFERENCES servicios(id),
    sucursal_id UUID REFERENCES sucursales(id),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_solicitada DATE NOT NULL,
    hora_solicitada TIME NOT NULL,
    hora_finalizacion_deseada TIME,
    status INT REFERENCES status_catalogo(id),
    notas TEXT
);

CREATE INDEX IF NOT EXISTS idx_citas_usuario_id ON citas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_citas_proveedor_id ON citas(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_citas_servicio_id ON citas(servicio_id);

CREATE TABLE IF NOT EXISTS confirmaciones (
    id SERIAL PRIMARY KEY,
    cita_id UUID NOT NULL REFERENCES citas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    proveedor_id UUID NOT NULL REFERENCES proveedores(id),
    servicio_id UUID NOT NULL REFERENCES servicios(id),
    telefono_whatsapp VARCHAR(30) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_confirmaciones_cita_id ON confirmaciones(cita_id);

-- Site logs
CREATE TABLE IF NOT EXISTS log_login (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS log_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    usuario_remitente UUID REFERENCES usuarios(id),
    usuario_destinatario UUID REFERENCES usuarios(id),
    message TEXT,
    html TEXT,
    correo_remitente VARCHAR(255),
    correo_destinatario VARCHAR(255),
    hora_envio TIMESTAMP NOT NULL DEFAULT NOW(),
    status INT
);
