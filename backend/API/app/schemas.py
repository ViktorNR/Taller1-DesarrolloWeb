from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
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
    rut: Optional[str] = None
    telefono: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)

class UsuarioUpdate(BaseModel):
    """Schema para actualización de usuario. Solo campos editables."""
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    rut: Optional[str] = None
    telefono: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

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

# ==================== DIRECCION DESPACHO SCHEMAS ====================

class DireccionDespachoBase(BaseModel):
    direccion: str = Field(..., min_length=1, max_length=255)
    comuna: str = Field(..., min_length=1, max_length=100)
    ciudad: str = Field(..., min_length=1, max_length=100)
    codigo_postal: Optional[str] = Field(None, max_length=10)
    es_principal: Optional[bool] = False
    activa: Optional[bool] = True
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class DireccionDespachoCreate(DireccionDespachoBase):
    pass

class DireccionDespachoUpdate(BaseModel):
    """Schema para actualización de dirección. Solo campos editables."""
    direccion: Optional[str] = Field(None, min_length=1, max_length=255)
    comuna: Optional[str] = Field(None, min_length=1, max_length=100)
    ciudad: Optional[str] = Field(None, min_length=1, max_length=100)
    codigo_postal: Optional[str] = Field(None, max_length=10)
    es_principal: Optional[bool] = None
    activa: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class DireccionDespachoResponse(DireccionDespachoBase):
    id: UUID
    usuario_id: UUID
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
    # Campos adicionales opcionales que se guardarán en metadata_json
    direccion: Optional[Dict[str, Any]] = None
    envio: Optional[Dict[str, Any]] = None
    cupon: Optional[Dict[str, Any]] = None
    datosPersonales: Optional[Dict[str, Any]] = None
    
    class Config:
        extra = "allow"  # Permitir campos adicionales

class DocumentoResponse(DocumentoBase):
    id: UUID
    usuario_id: UUID
    ruta_documento: Optional[str] = None
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
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    class Config:
        extra = "allow"  # Permitir campos adicionales

class DetalleDocumentoResponse(DetalleDocumentoBase):
    id: UUID
    documento_id: UUID
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="metadata_json")
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    
    class Config:
        from_attributes = True
        populate_by_name = True

# ==================== COMPRA SCHEMAS ====================

class CompraResponse(BaseModel):
    """Schema para respuesta de compras con detalles completos"""
    id: UUID
    estado: str
    monto_total: float
    fecha_creacion: datetime
    fecha_actualizacion: datetime
    detalles: List[DetalleDocumentoResponse]
    ruta_documento: Optional[str] = None
    
    class Config:
        from_attributes = True

# ==================== CHECKOUT SCHEMAS ====================

class DireccionEnvio(BaseModel):
    """Schema para dirección de envío"""
    direccion: str = Field(..., min_length=1)
    codigo_postal: Optional[str] = None
    comuna: str = Field(..., min_length=1)
    ciudad: str = Field(..., min_length=1)

class ProductoCheckout(BaseModel):
    """Schema para producto en checkout"""
    producto_id: int = Field(..., gt=0)
    cantidad: int = Field(..., gt=0)
    precio: float = Field(..., gt=0)

class CheckoutRequest(BaseModel):
    """Schema para request de checkout"""
    rut: str = Field(..., min_length=1)
    email: EmailStr
    telefono: str = Field(..., min_length=1)
    direccion: DireccionEnvio
    metodo_envio_id: int = Field(..., gt=0)
    productos: List[ProductoCheckout] = Field(..., min_length=1)