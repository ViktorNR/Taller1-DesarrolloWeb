from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from uuid import UUID

from .database import engine, get_db, Base
from .models import Usuario, Documento, DetalleDocumento
from .schemas import (
    UsuarioCreate, UsuarioResponse, 
    DocumentoCreate, DocumentoResponse,
    DetalleDocumentoCreate, DetalleDocumentoResponse,
    Token
)
from .auth import (
    authenticate_user, create_access_token, 
    get_current_user, get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API con JWT y PostgreSQL",
    description="API con autenticación JWT y PostgreSQL JSONB",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ==================== AUTH ENDPOINTS ====================

@app.post("/token", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Endpoint para obtener token JWT"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UsuarioCreate, db: Session = Depends(get_db)):
    """Registrar nuevo usuario"""
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    db_user = db.query(Usuario).filter(Usuario.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username ya registrado")
    
    hashed_password = get_password_hash(user.password)
    db_user = Usuario(
        email=user.email,
        username=user.username,
        password_hash=hashed_password,
        nombre=user.nombre,
        apellido=user.apellido,
        metadata_json=user.metadata or {}
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=UsuarioResponse)
async def read_users_me(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return current_user

# ==================== USUARIOS ENDPOINTS ====================

@app.get("/usuarios", response_model=List[UsuarioResponse])
def get_usuarios(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Listar usuarios (requiere autenticación)"""
    usuarios = db.query(Usuario).offset(skip).limit(limit).all()
    return usuarios

@app.get("/usuarios/{usuario_id}", response_model=UsuarioResponse)
def get_usuario(
    usuario_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener usuario por ID"""
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# ==================== DOCUMENTOS ENDPOINTS ====================

@app.post("/documentos", response_model=DocumentoResponse, status_code=status.HTTP_201_CREATED)
def create_documento(
    documento: DocumentoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear nuevo documento"""
    db_documento = Documento(
        usuario_id=current_user.id,
        titulo=documento.titulo,
        tipo=documento.tipo,
        estado=documento.estado or "borrador",
        contenido=documento.contenido or {},
        metadata_json=documento.metadata or {}
    )
    
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    return db_documento

@app.get("/documentos", response_model=List[DocumentoResponse])
def get_documentos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Listar documentos del usuario actual"""
    documentos = db.query(Documento).filter(
        Documento.usuario_id == current_user.id
    ).offset(skip).limit(limit).all()
    return documentos

@app.get("/documentos/{documento_id}", response_model=DocumentoResponse)
def get_documento(
    documento_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener documento por ID"""
    documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return documento

@app.put("/documentos/{documento_id}", response_model=DocumentoResponse)
def update_documento(
    documento_id: UUID,
    documento: DocumentoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar documento"""
    db_documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not db_documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    db_documento.titulo = documento.titulo
    db_documento.tipo = documento.tipo
    db_documento.estado = documento.estado
    db_documento.contenido = documento.contenido
    db_documento.metadata_json = documento.metadata
    
    db.commit()
    db.refresh(db_documento)
    return db_documento

@app.delete("/documentos/{documento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_documento(
    documento_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Eliminar documento"""
    db_documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not db_documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    db.delete(db_documento)
    db.commit()
    return None

# ==================== DETALLE DOCUMENTOS ENDPOINTS ====================

@app.post("/documentos/{documento_id}/detalles", response_model=DetalleDocumentoResponse)
def create_detalle(
    documento_id: UUID,
    detalle: DetalleDocumentoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear detalle de documento"""
    documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    db_detalle = DetalleDocumento(
        documento_id=documento_id,
        clave=detalle.clave,
        valor=detalle.valor,
        datos_json=detalle.datos_json or {},
        orden=detalle.orden or 0
    )
    
    db.add(db_detalle)
    db.commit()
    db.refresh(db_detalle)
    return db_detalle

@app.get("/documentos/{documento_id}/detalles", response_model=List[DetalleDocumentoResponse])
def get_detalles(
    documento_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener detalles de un documento"""
    documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    detalles = db.query(DetalleDocumento).filter(
        DetalleDocumento.documento_id == documento_id
    ).order_by(DetalleDocumento.orden).all()
    
    return detalles

# ==================== HEALTH CHECK ====================

@app.get("/")
def root():
    """Health check"""
    return {
        "status": "ok",
        "message": "API funcionando correctamente",
        "version": "1.0.0"
    }