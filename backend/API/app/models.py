from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    nombre = Column(String(100))
    apellido = Column(String(100))
    activo = Column(Boolean, default=True)
    rol = Column(String(50), default="user")
    metadata_json = Column("metadata", JSONB, default={})
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    documentos = relationship("Documento", back_populates="usuario", cascade="all, delete-orphan")

class Documento(Base):
    __tablename__ = "documentos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False)
    tipo = Column(String(100))
    estado = Column(String(50), default="borrador")
    contenido = Column(JSONB, default={})
    metadata_json = Column("metadata", JSONB, default={})
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="documentos")
    detalles = relationship("DetalleDocumento", back_populates="documento", cascade="all, delete-orphan")

class DetalleDocumento(Base):
    __tablename__ = "detalle_documentos"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    documento_id = Column(UUID(as_uuid=True), ForeignKey("documentos.id", ondelete="CASCADE"), nullable=False)
    clave = Column(String(255), nullable=False)
    valor = Column(Text)
    datos_json = Column(JSONB, default={})
    orden = Column(Integer, default=0)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relaciones
    documento = relationship("Documento", back_populates="detalles")