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
    rut VARCHAR(12) UNIQUE,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    rol VARCHAR(50) DEFAULT 'user',
    metadata JSONB DEFAULT '{}',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS direcciones_despacho (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    direccion VARCHAR(255) NOT NULL,
    comuna VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    es_principal BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de documentos
CREATE TABLE IF NOT EXISTS documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'borrador',
    monto_total FLOAT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de detalle de documentos
CREATE TABLE IF NOT EXISTS detalle_documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
    producto VARCHAR(255) NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices para mejor rendimiento

CREATE INDEX idx_usuarios_rut ON usuarios(rut);
CREATE INDEX idx_usuarios_username ON usuarios(username);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_documentos_usuario ON documentos(usuario_id);
CREATE INDEX idx_documentos_estado ON documentos(estado);
CREATE INDEX idx_detalle_documento ON detalle_documentos(documento_id);
CREATE INDEX idx_direcciones_usuario ON direcciones_despacho(usuario_id);
CREATE INDEX idx_direcciones_principal ON direcciones_despacho(usuario_id, es_principal) WHERE es_principal = true;
CREATE INDEX idx_direcciones_activa ON direcciones_despacho(activa);
CREATE INDEX idx_direcciones_comuna ON direcciones_despacho(comuna);
CREATE INDEX idx_direcciones_ciudad ON direcciones_despacho(ciudad);
CREATE INDEX idx_direcciones_metadata ON direcciones_despacho USING GIN (metadata);

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

-- Función para calcular monto_total automáticamente
CREATE OR REPLACE FUNCTION actualizar_monto_total()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE documentos
    SET monto_total = COALESCE((SELECT SUM(precio * cantidad) FROM detalle_documentos WHERE documento_id = OLD.documento_id), 0)
    WHERE id = OLD.documento_id;
    RETURN OLD;
  ELSE
    UPDATE documentos
    SET monto_total = COALESCE((SELECT SUM(precio * cantidad) FROM detalle_documentos WHERE documento_id = NEW.documento_id), 0)
    WHERE id = NEW.documento_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_detalle_monto ON detalle_documentos;
CREATE TRIGGER trigger_detalle_monto
    AFTER INSERT OR UPDATE OR DELETE ON detalle_documentos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_monto_total();

-- Usuario de prueba (password: admin123)
-- Hash generado con bcrypt
INSERT INTO usuarios (email, username, password_hash, nombre, apellido, rol, metadata)
VALUES (
    'admin@example.com',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqHGvqAGeu',
    'Admin',
    'Sistema',
    '20067969-5',
    '+56972134846',
    true,
    'admin',
    '{"permisos": ["read", "write", "delete"], "tema": "dark"}',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;