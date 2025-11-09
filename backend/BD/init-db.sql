-- Habilitar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) DEFAULT 'user',
    metadata JSONB DEFAULT '{}',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'borrador',
    contenido JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de detalle de documentos
CREATE TABLE IF NOT EXISTS detalle_documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
    clave VARCHAR(255) NOT NULL,
    valor TEXT,
    datos_json JSONB DEFAULT '{}',
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_documentos_usuario ON documentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_documentos_estado ON documentos(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_documento ON detalle_documentos(documento_id);

-- Índices GIN para búsquedas en JSONB (muy importante para NoSQL)
CREATE INDEX IF NOT EXISTS idx_usuarios_metadata ON usuarios USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_documentos_contenido ON documentos USING GIN (contenido);
CREATE INDEX IF NOT EXISTS idx_documentos_metadata ON documentos USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_detalle_datos_json ON detalle_documentos USING GIN (datos_json);

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar automáticamente fecha_actualizacion
CREATE TRIGGER trigger_usuarios_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

CREATE TRIGGER trigger_documentos_actualizacion
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

CREATE TRIGGER trigger_detalle_actualizacion
    BEFORE UPDATE ON detalle_documentos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_actualizacion();

-- Usuario de prueba (password: admin123)
-- Hash generado con bcrypt
INSERT INTO usuarios (email, username, password_hash, nombre, apellido, rol, metadata)
VALUES (
    'admin@example.com',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqHGvqAGeu',
    'Admin',
    'Sistema',
    'admin',
    '{"permisos": ["read", "write", "delete"], "tema": "dark"}'
) ON CONFLICT (email) DO NOTHING;