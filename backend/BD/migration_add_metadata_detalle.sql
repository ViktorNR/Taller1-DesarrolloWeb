-- Migración: Agregar campo metadata a detalle_documentos
-- Ejecutar este script si la tabla ya existe y necesita agregar el campo metadata

-- Agregar columna metadata si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'detalle_documentos' 
        AND column_name = 'metadata'
    ) THEN
        ALTER TABLE detalle_documentos 
        ADD COLUMN metadata JSONB DEFAULT '{}';
        
        -- Crear índice GIN para metadata
        CREATE INDEX IF NOT EXISTS idx_detalle_metadata 
        ON detalle_documentos USING GIN (metadata);
        
        RAISE NOTICE 'Campo metadata agregado a detalle_documentos';
    ELSE
        RAISE NOTICE 'Campo metadata ya existe en detalle_documentos';
    END IF;
END $$;


