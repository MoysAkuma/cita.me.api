# cita.me.api

API REST de Cita.me para autenticacion, gestion de usuarios, proveedores, catalogos y citas.

## Descripcion

Este proyecto expone los endpoints backend del ecosistema Cita.me.

- Registro/login con JWT (access + refresh token)
- Gestion de usuarios y foto de perfil
- Gestion completa de proveedores (sucursales, empleados, servicios, horarios, documentacion)
- Gestion de citas y confirmaciones
- Catalogos de categorias, ciudades, estados y status
- Documentacion OpenAPI con Swagger UI

## Stack Tecnologico

- Node.js + TypeScript
- Express
- PostgreSQL (`pg`)
- Redis (`ioredis`) para blacklist de JWT
- Zod para validacion de payloads
- Swagger (`swagger-ui-express`, `swagger-jsdoc`)

## Arquitectura

El proyecto esta organizado por features:

- `controller`: capa HTTP
- `service`: logica de negocio
- `repository`: acceso a datos (queries SQL)
- `schema`: validacion y tipos con Zod
- `routes`: definicion de rutas

Tambien incluye:

- middlewares (`auth`, `validate`, `error`)
- configuracion (`env`, `database`, `redis`, `swagger`)
- utilidades (`logger`, `response`)

## Requisitos

- Node.js 18+
- npm 9+
- PostgreSQL 13+
- Redis 6+

## Variables de Entorno

Crear archivo `.env` en la raiz del proyecto (`cita.me.api/.env`) con:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://usuario:password@localhost:5432/citame
REDIS_URL=redis://localhost:6379

JWT_SECRET=tu_jwt_secret
JWT_REFRESH_SECRET=tu_jwt_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Instalacion

```bash
npm install
```

## Comandos Disponibles

### Desarrollo

```bash
npm run dev
```

Levanta el servidor con recarga automatica en cambios (`ts-node-dev`).

### Build

```bash
npm run build
```

Compila TypeScript a `dist/`.

### Produccion

```bash
npm run start
```

Ejecuta la app compilada desde `dist/server.js`.

### Lint

```bash
npm run lint
```

Ejecuta ESLint sobre `src`.

## Comandos de Base de Datos

Este proyecto incluye el script:

- `migrations/001_initial_schema.sql`

Ejemplo para ejecutar la migracion inicial manualmente:

```bash
psql "postgresql://usuario:password@localhost:5432/citame" -f migrations/001_initial_schema.sql
```

## Correr la API

1. Levanta PostgreSQL y Redis
2. Configura `.env`
3. Ejecuta migraciones SQL
4. Inicia la API:

```bash
npm run dev
```

Servidor por defecto:

- API: `http://localhost:3001`
- Healthcheck: `GET /health`
- Swagger UI: `http://localhost:3001/docs`

## Seguridad y Middlewares

- `helmet` para headers de seguridad
- `cors` habilitado globalmente
- `morgan` para logging HTTP
- Rate limiting:
	- Global: 100 requests / 15 min / IP
	- Auth: 20 requests / 15 min / IP
- Auth JWT con middleware `authenticate`
- Blacklist de tokens revocados en Redis

## Endpoints Principales

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout` (requiere bearer token)
- `POST /auth/refresh`

### Usuarios

- `GET /user`
- `GET /user/:id`
- `PUT /user/:id`
- `DELETE /user/:id`
- `PATCH /user/:id/photo`

### Proveedores

- `GET /proveedores`
- `GET /proveedores/:id`
- `POST /proveedores`
- `PUT /proveedores/:id`
- `DELETE /proveedores/:id`

Subrecursos:

- Sucursales: `/proveedores/:proveedorId/sucursales`
- Empleados: `/proveedores/:proveedorId/empleados`
- Servicios: `/proveedores/:proveedorId/servicios`
- Horarios: `/proveedores/:proveedorId/horarios`
- Documentacion: `/proveedores/:proveedorId/documentacion`

### Citas

- `GET /citas`
- `GET /citas/:id`
- `POST /citas`
- `PUT /citas/:id`
- `PATCH /citas/:id/status`
- `DELETE /citas/:id`
- `GET /citas/:citaId/confirmaciones`
- `POST /citas/:citaId/confirmaciones`

### Catalogos

- `GET /catalogues/categorias-proveedores`
- `GET /catalogues/categorias-servicios`
- `GET /catalogues/ciudades`
- `GET /catalogues/estados`
- `GET /catalogues/status`

Y CRUD protegido para categorias y status.

## Autenticacion

Rutas protegidas requieren header:

```http
Authorization: Bearer <access_token>
```

El `access_token` se obtiene en login/register. Para renovarlo usa `/auth/refresh` con `refreshToken`.

## Formato de Respuesta

Exitos:

```json
{
	"success": true,
	"message": "Success",
	"data": {}
}
```

Errores:

```json
{
	"success": false,
	"message": "Validation error",
	"errors": []
}
```

Paginacion:

```json
{
	"success": true,
	"message": "Success",
	"data": [],
	"pagination": {
		"total": 100,
		"page": 1,
		"limit": 20,
		"totalPages": 5
	}
}
```

## Codigos de Error Comunes

- `400` validacion o foreign key invalida
- `401` token invalido/expirado/no enviado
- `404` recurso no encontrado
- `409` violacion de unicidad (ej. correo duplicado)
- `429` rate limit excedido
- `500` error interno

## Estructura del Proyecto

```txt
src/
	app.ts
	server.ts
	config/
		database.ts
		env.ts
		redis.ts
		swagger.ts
	features/
		auth/
		users/
		providers/
		appointments/
		catalogues/
	middleware/
	utils/
migrations/
	001_initial_schema.sql
```

## Documentacion API (Swagger)

Swagger UI esta disponible en:

- `http://localhost:3000/docs`

Incluye schemas, seguridad Bearer JWT y cobertura de endpoints del sistema.
