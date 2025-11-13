-- Migración: Agregar columnas ruta_documento y metadata a documentos
-- Ejecutar este script si la tabla ya existe y necesita agregar estas columnas

-- Agregar columna ruta_documento si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documentos' 
        AND column_name = 'ruta_documento'
    ) THEN
        ALTER TABLE documentos 
        ADD COLUMN ruta_documento VARCHAR(255);
        
        RAISE NOTICE 'Columna ruta_documento agregada a documentos';
    ELSE
        RAISE NOTICE 'Columna ruta_documento ya existe en documentos';
    END IF;
END $$;

-- Agregar columna metadata si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documentos' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE documentos 
        ADD COLUMN metadata JSONB DEFAULT '{}';
        
        -- Crear índice GIN para metadata
        CREATE INDEX IF NOT EXISTS idx_documentos_metadata 
        ON documentos USING GIN (metadata);
        
        RAISE NOTICE 'Columna metadata agregada a documentos';
    ELSE
        RAISE NOTICE 'Columna metadata ya existe en documentos';
    END IF;
END $$;


