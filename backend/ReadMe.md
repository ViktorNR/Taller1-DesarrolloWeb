# API FastAPI con PostgreSQL y JWT

Sistema de autenticación JWT con FastAPI y PostgreSQL usando JSONB para funcionalidad NoSQL.

## 📁 Estructura del Proyecto

```
proyecto/
├── docker-compose.yml
├── .env
├── .env.example
├── database/
│   ├── Dockerfile
│   └── init-db.sql
└── api/
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── __init__.py
        ├── main.py
        ├── database.py
        ├── models.py
        ├── schemas.py
        └── auth.py
```

## 🚀 Inicio Rápido

### 1. Clonar y configurar

```bash
# Crear la estructura de directorios
mkdir -p proyecto/database proyecto/api/app
cd proyecto

# Copiar todos los archivos en sus respectivas ubicaciones
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

### 2. Generar SECRET_KEY segura

```bash
# En Linux/Mac
openssl rand -hex 32

# O en Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Copia el resultado en `.env` como `SECRET_KEY`

### 3. Crear archivo __init__.py

```bash
touch api/app/__init__.py
```

### 4. Levantar los contenedores

```bash
# Construir e iniciar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

## 📡 Endpoints de la API

### Autenticación

#### Registrar Usuario
```bash
curl -X POST "http://localhost:8000/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "username": "usuario",
    "password": "password123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "metadata": {"preferencias": "tema oscuro"}
  }'
```

#### Login (Obtener Token)
```bash
curl -X POST "http://localhost:8000/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=usuario&password=password123"
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Obtener Usuario Actual
```bash
curl -X GET "http://localhost:8000/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Documentos

#### Crear Documento (con JSONB)
```bash
curl -X POST "http://localhost:8000/documentos" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Mi Documento",
    "tipo": "reporte",
    "estado": "borrador",
    "contenido": {
      "capitulos": [
        {"numero": 1, "titulo": "Introducción"},
        {"numero": 2, "titulo": "Desarrollo"}
      ],
      "tags": ["importante", "urgente"]
    },
    "metadata": {
      "version": "1.0",
      "autor_secundario": "María López"
    }
  }'
```

#### Listar Documentos
```bash
curl -X GET "http://localhost:8000/documentos" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Actualizar Documento
```bash
curl -X PUT "http://localhost:8000/documentos/{documento_id}" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Documento Actualizado",
    "tipo": "reporte",
    "estado": "publicado",
    "contenido": {"nuevo_campo": "valor"}
  }'
```

### Detalle de Documentos

#### Agregar Detalle
```bash
curl -X POST "http://localhost:8000/documentos/{documento_id}/detalles" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clave": "seccion_1",
    "valor": "Contenido de la sección",
    "datos_json": {
      "formato": "markdown",
      "palabra_count": 150
    },
    "orden": 1
  }'
```

## 🗄️ Uso de JSONB como NoSQL

PostgreSQL con JSONB te permite almacenar y consultar datos flexibles:

### Consultas JSONB Avanzadas

```sql
-- Buscar en campos JSONB
SELECT * FROM documentos 
WHERE contenido @> '{"tags": ["urgente"]}';

-- Extraer valores específicos
SELECT id, contenido->>'version' as version 
FROM documentos;

-- Actualizar campos JSONB
UPDATE documentos 
SET contenido = contenido || '{"nuevo_campo": "valor"}'::jsonb
WHERE id = 'uuid-aqui';

-- Buscar por clave en metadata
SELECT * FROM usuarios 
WHERE metadata ? 'preferencias';
```

### Índices GIN para Performance

Los índices GIN ya están creados en `init-db.sql`:

```sql
CREATE INDEX idx_documentos_contenido ON documentos USING GIN (contenido);
CREATE INDEX idx_usuarios_metadata ON usuarios USING GIN (metadata);
```

## 🔧 Comandos Útiles

### Docker

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart api

# Ver logs en tiempo real
docker-compose logs -f api

# Ejecutar comandos en contenedor
docker-compose exec api bash
docker-compose exec db psql -U app_user -d app_db
```

### Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec db psql -U app_user -d app_db

# Backup
docker-compose exec db pg_dump -U app_user app_db > backup.sql

# Restore
docker-compose exec -T db psql -U app_user app_db < backup.sql
```

### Testing

```bash
# Instalar httpie para testing más fácil
pip install httpie

# Login y guardar token
http POST localhost:8000/token username=admin password=admin123

# Request con token
http GET localhost:8000/users/me "Authorization: Bearer TOKEN_AQUI"
```

## 📚 Documentación Interactiva

FastAPI genera documentación automática:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Seguridad

### Mejores Prácticas

1. **Cambiar credenciales por defecto** en `.env`
2. **Usar HTTPS** en producción
3. **Configurar CORS** apropiadamente en `main.py`
4. **Rotar SECRET_KEY** regularmente
5. **Limitar rate limiting** (implementar con middleware)
6. **Validar inputs** con Pydantic schemas

### Usuario de Prueba

El script `init-db.sql` crea un usuario admin:
- **Username**: admin
- **Password**: admin123
- **Email**: admin@example.com

**⚠️ CAMBIAR EN PRODUCCIÓN**

## 🎯 Próximos Pasos

### Extensiones Recomendadas

1. **Refresh Tokens** para sesiones largas
2. **Rate Limiting** con slowapi
3. **Logging** estructurado
4. **Testing** con pytest
5. **Migrations** con Alembic
6. **Monitoring** con Prometheus
7. **Caché** con Redis

### Extensiones PostgreSQL Adicionales

```sql
-- PostGIS para datos geoespaciales
CREATE EXTENSION postgis;

-- pg_trgm para búsqueda full-text
CREATE EXTENSION pg_trgm;

-- uuid-ossp para UUIDs (ya instalado)
CREATE EXTENSION "uuid-ossp";
```

## 🐛 Troubleshooting

### Puerto 5432 ocupado
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"
```

### Contenedor de API no conecta a DB
```bash
# Verificar que healthcheck de DB esté OK
docker-compose ps

# Ver logs de DB
docker-compose logs db
```

### Problemas con migraciones
```bash
# Recrear base de datos
docker-compose down -v
docker-compose up --build
```

## 📄 Licencia

MIT

## 👥 Contribuir

Pull requests son bienvenidos. Para cambios mayores, abre un issue primero.

---

**¡Tu API está lista para usar!** 🎉