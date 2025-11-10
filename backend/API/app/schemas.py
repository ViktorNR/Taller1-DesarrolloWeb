from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

# ==================== TOKEN SCHEMAS ====================

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# ==================== USUARIO SCHEMAS ====================

class UsuarioBase(BaseModel):
    email: EmailStr
    username: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)

class UsuarioResponse(UsuarioBase):
    id: UUID
    activo: bool
    rol: str
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="metadata_json")
    
    class Config:
        from_attributes = True
        populate_by_name = True

# ==================== DOCUMENTO SCHEMAS ====================

class DocumentoBase(BaseModel):
    estado: Optional[str] = "borrador"
    monto_total: float = Field(0, ge=0)

class DocumentoCreate(DocumentoBase):
    pass

class DocumentoResponse(DocumentoBase):
    id: UUID
    usuario_id: UUID
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True

# ==================== DETALLE DOCUMENTO SCHEMAS ====================

class DetalleDocumentoBase(BaseModel):
    producto: str = Field(..., min_length=1, max_length=255)
    precio: float = Field(..., gt=0)
    cantidad: Optional[int] = Field(1, ge=1)

class DetalleDocumentoCreate(DetalleDocumentoBase):
    pass

class DetalleDocumentoResponse(DetalleDocumentoBase):
    id: UUID
    documento_id: UUID
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True