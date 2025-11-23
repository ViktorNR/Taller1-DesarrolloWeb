from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID
import json
import os

from .database import engine, get_db, Base
from .models import Usuario, Documento, DetalleDocumento, DireccionDespacho
from .schemas import (
    UsuarioCreate, UsuarioResponse, UsuarioUpdate,
    DocumentoCreate, DocumentoResponse,
    DetalleDocumentoCreate, DetalleDocumentoResponse,
    CompraResponse,
    CheckoutRequest,
    Token,
    DireccionDespachoCreate, DireccionDespachoUpdate, DireccionDespachoResponse
)
from .validators import validar_rut_chileno, validar_telefono_chileno, validar_complejidad_password
from .services.documento_service import generar_pdf_documento
from .auth import (
    authenticate_user, create_access_token, 
    get_current_user, get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Crear tablas (solo si la base de datos está disponible)
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    # Si la base de datos no está disponible, continuar sin crear tablas
    # Las tablas se crearán cuando la base de datos esté disponible
    pass

app = FastAPI(
    title="API con JWT y PostgreSQL",
    description="API con autenticación JWT y PostgreSQL JSONB",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://localhost:8081",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
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
    errors = {}
    
    # Normalizar strings vacíos a None para campos opcionales
    if user.nombre and user.nombre.strip() == "":
        user.nombre = None
    if user.apellido and user.apellido.strip() == "":
        user.apellido = None
    if user.rut and user.rut.strip() == "":
        user.rut = None
    if user.telefono and user.telefono.strip() == "":
        user.telefono = None
    
    # Validar unicidad de email
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if db_user:
        errors["email"] = "Email ya registrado"
    
    # Validar unicidad de username
    db_user = db.query(Usuario).filter(Usuario.username == user.username).first()
    if db_user:
        errors["username"] = "Username ya registrado"
    
    # Validar complejidad de contraseña
    es_valido, mensaje = validar_complejidad_password(user.password)
    if not es_valido:
        errors["password"] = mensaje
    
    # Validar RUT si se proporciona
    if user.rut is not None:
        es_valido, resultado = validar_rut_chileno(user.rut)
        if not es_valido:
            errors["rut"] = resultado
        else:
            # Normalizar RUT
            user.rut = resultado
            
            # Verificar unicidad de RUT
            rut_existente = db.query(Usuario).filter(Usuario.rut == user.rut).first()
            if rut_existente:
                errors["rut"] = "RUT ya registrado"
    
    # Validar teléfono si se proporciona
    if user.telefono is not None:
        es_valido, resultado = validar_telefono_chileno(user.telefono)
        if not es_valido:
            errors["telefono"] = resultado
        else:
            # Normalizar teléfono
            user.telefono = resultado
    
    # Si hay errores, retornarlos
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors
        )
    
    # Crear usuario
    try:
        hashed_password = get_password_hash(user.password)
        db_user = Usuario(
            email=user.email,
            username=user.username,
            password_hash=hashed_password,
            nombre=user.nombre,
            apellido=user.apellido,
            rut=user.rut,
            telefono=user.telefono,
            metadata_json=user.metadata or {}
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario: {str(e)}"
        )

@app.get("/users/me", response_model=UsuarioResponse)
async def read_users_me(current_user: Usuario = Depends(get_current_user)):
    """Obtener información del usuario actual"""
    return current_user

@app.put("/usuarios/me", response_model=UsuarioResponse)
def update_usuario_me(
    usuario_update: UsuarioUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar información del usuario actual"""
    # Validar RUT si se proporciona
    if usuario_update.rut is not None:
        es_valido, resultado = validar_rut_chileno(usuario_update.rut)
        if not es_valido:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"rut": resultado}
            )
        # Normalizar RUT
        usuario_update.rut = resultado
        
        # Verificar unicidad de RUT (excepto si es el mismo usuario)
        rut_existente = db.query(Usuario).filter(
            Usuario.rut == usuario_update.rut,
            Usuario.id != current_user.id
        ).first()
        if rut_existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="RUT ya registrado por otro usuario"
            )
    
    # Validar teléfono si se proporciona
    if usuario_update.telefono is not None:
        es_valido, resultado = validar_telefono_chileno(usuario_update.telefono)
        if not es_valido:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"telefono": resultado}
            )
        # Normalizar teléfono
        usuario_update.telefono = resultado
    
    # Actualizar campos
    update_data = usuario_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/usuarios/me/compras", response_model=List[CompraResponse])
def get_mis_compras(
    skip: int = 0,
    limit: int = 20,
    estado: Optional[str] = None,
    orden: str = "fecha_desc",
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener compras anteriores del usuario actual"""
    # Validar límite máximo
    if limit > 100:
        limit = 100
    
    # Construir query base
    query = db.query(Documento).filter(Documento.usuario_id == current_user.id)
    
    # Filtrar por estado si se proporciona
    if estado:
        query = query.filter(Documento.estado == estado)
    
    # Ordenar
    if orden == "fecha_desc":
        query = query.order_by(Documento.fecha_creacion.desc())
    elif orden == "fecha_asc":
        query = query.order_by(Documento.fecha_creacion.asc())
    elif orden == "monto_desc":
        query = query.order_by(Documento.monto_total.desc())
    elif orden == "monto_asc":
        query = query.order_by(Documento.monto_total.asc())
    else:
        query = query.order_by(Documento.fecha_creacion.desc())
    
    # Paginación
    documentos = query.offset(skip).limit(limit).all()
    
    # Construir respuesta con detalles
    compras = []
    for doc in documentos:
        detalles = db.query(DetalleDocumento).filter(
            DetalleDocumento.documento_id == doc.id
        ).all()
        
        compra_dict = {
            "id": doc.id,
            "estado": doc.estado,
            "monto_total": doc.monto_total,
            "fecha_creacion": doc.fecha_creacion,
            "fecha_actualizacion": doc.fecha_actualizacion,
            "detalles": detalles,
            "ruta_documento": doc.ruta_documento if hasattr(doc, 'ruta_documento') else None
        }
        compras.append(CompraResponse(**compra_dict))
    
    return compras

# ==================== DIRECCIONES DESPACHO ENDPOINTS ====================

@app.post("/usuarios/me/direcciones", response_model=DireccionDespachoResponse, status_code=status.HTTP_201_CREATED)
def create_direccion_despacho(
    direccion: DireccionDespachoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Crear nueva dirección de despacho para el usuario actual"""
    # Si se marca como principal, desmarcar las demás
    if direccion.es_principal:
        db.query(DireccionDespacho).filter(
            DireccionDespacho.usuario_id == current_user.id,
            DireccionDespacho.es_principal == True
        ).update({"es_principal": False})
    
    db_direccion = DireccionDespacho(
        usuario_id=current_user.id,
        direccion=direccion.direccion,
        comuna=direccion.comuna,
        ciudad=direccion.ciudad,
        codigo_postal=direccion.codigo_postal,
        es_principal=direccion.es_principal or False,
        activa=direccion.activa if direccion.activa is not None else True,
        metadata_json=direccion.metadata or {}
    )
    
    db.add(db_direccion)
    db.commit()
    db.refresh(db_direccion)
    return db_direccion

@app.get("/usuarios/me/direcciones", response_model=List[DireccionDespachoResponse])
def get_direcciones_despacho(
    activa: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Listar direcciones de despacho del usuario actual"""
    query = db.query(DireccionDespacho).filter(
        DireccionDespacho.usuario_id == current_user.id
    )
    
    # Filtrar por estado activa si se proporciona
    if activa is not None:
        query = query.filter(DireccionDespacho.activa == activa)
    
    # Ordenar: principal primero, luego por fecha de creación
    direcciones = query.order_by(
        DireccionDespacho.es_principal.desc(),
        DireccionDespacho.fecha_creacion.desc()
    ).all()
    
    return direcciones

@app.get("/usuarios/me/direcciones/{direccion_id}", response_model=DireccionDespachoResponse)
def get_direccion_despacho(
    direccion_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener dirección de despacho por ID"""
    direccion = db.query(DireccionDespacho).filter(
        DireccionDespacho.id == direccion_id,
        DireccionDespacho.usuario_id == current_user.id
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    return direccion

@app.put("/usuarios/me/direcciones/{direccion_id}", response_model=DireccionDespachoResponse)
def update_direccion_despacho(
    direccion_id: UUID,
    direccion_update: DireccionDespachoUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar dirección de despacho"""
    db_direccion = db.query(DireccionDespacho).filter(
        DireccionDespacho.id == direccion_id,
        DireccionDespacho.usuario_id == current_user.id
    ).first()
    
    if not db_direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    # Si se marca como principal, desmarcar las demás
    if direccion_update.es_principal is True:
        db.query(DireccionDespacho).filter(
            DireccionDespacho.usuario_id == current_user.id,
            DireccionDespacho.es_principal == True,
            DireccionDespacho.id != direccion_id
        ).update({"es_principal": False})
    
    # Actualizar campos
    update_data = direccion_update.model_dump(exclude_unset=True)
    if "metadata" in update_data:
        update_data["metadata_json"] = update_data.pop("metadata")
    
    for field, value in update_data.items():
        setattr(db_direccion, field, value)
    
    db.commit()
    db.refresh(db_direccion)
    return db_direccion

@app.delete("/usuarios/me/direcciones/{direccion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_direccion_despacho(
    direccion_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Eliminar dirección de despacho"""
    db_direccion = db.query(DireccionDespacho).filter(
        DireccionDespacho.id == direccion_id,
        DireccionDespacho.usuario_id == current_user.id
    ).first()
    
    if not db_direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    db.delete(db_direccion)
    db.commit()
    return None

@app.put("/usuarios/me/direcciones/{direccion_id}/principal", response_model=DireccionDespachoResponse)
def marcar_direccion_principal(
    direccion_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Marcar dirección como principal"""
    db_direccion = db.query(DireccionDespacho).filter(
        DireccionDespacho.id == direccion_id,
        DireccionDespacho.usuario_id == current_user.id
    ).first()
    
    if not db_direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
    
    # Desmarcar todas las demás direcciones como principales
    db.query(DireccionDespacho).filter(
        DireccionDespacho.usuario_id == current_user.id,
        DireccionDespacho.es_principal == True,
        DireccionDespacho.id != direccion_id
    ).update({"es_principal": False})
    
    # Marcar esta dirección como principal
    db_direccion.es_principal = True
    db.commit()
    db.refresh(db_direccion)
    return db_direccion

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
    try:
        # Construir metadata con campos adicionales
        metadata = {}
        if documento.direccion:
            metadata["direccion"] = documento.direccion
        if documento.envio:
            metadata["envio"] = documento.envio
        if documento.cupon:
            metadata["cupon"] = documento.cupon
        if documento.datosPersonales:
            metadata["datosPersonales"] = documento.datosPersonales
        
        # Incluir cualquier campo adicional que pueda venir en el request
        try:
            documento_dict = documento.model_dump(exclude={"estado", "monto_total", "direccion", "envio", "cupon", "datosPersonales"}, exclude_none=True)
            for key, value in documento_dict.items():
                if value is not None:
                    metadata[key] = value
        except Exception as e:
            # Si hay error al hacer model_dump, continuar sin campos adicionales
            pass
        
        db_documento = Documento(
            usuario_id=current_user.id,
            estado=documento.estado or "borrador",
            monto_total=documento.monto_total if documento.monto_total is not None else 0.0,
            metadata_json=metadata if metadata else {}
        )
        
        db.add(db_documento)
        db.commit()
        db.refresh(db_documento)
        return db_documento
    except Exception as e:
        db.rollback()
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error al crear documento: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear documento: {str(e)}"
        )

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

    # Recalcular monto_total al leer (no persistimos automáticamente aquí)
    detalles = db.query(DetalleDocumento).filter(DetalleDocumento.documento_id == documento_id).all()
    total = sum((d.precio or 0) * (d.cantidad or 0) for d in detalles)
    documento.monto_total = float(total)
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
    
    db_documento.estado = documento.estado
    # Recalcular monto_total desde los detalles actuales
    detalles = db.query(DetalleDocumento).filter(DetalleDocumento.documento_id == documento_id).all()
    total = sum((d.precio or 0) * (d.cantidad or 0) for d in detalles)
    db_documento.monto_total = float(total)
    
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
    
    # Construir metadata desde el detalle
    metadata = detalle.metadata or {}
    
    # Incluir cualquier campo adicional que pueda venir en el request
    detalle_dict = detalle.model_dump(exclude={"producto", "precio", "cantidad", "metadata"}, exclude_none=True)
    for key, value in detalle_dict.items():
        if value is not None:
            metadata[key] = value
    
    db_detalle = DetalleDocumento(
        documento_id=documento_id,
        producto=detalle.producto,
        precio=detalle.precio,
        cantidad=detalle.cantidad or 1,
        metadata_json=metadata if metadata else {}
    )
    
    db.add(db_detalle)
    db.commit()
    db.refresh(db_detalle)

    # Recalcular y persistir monto_total del documento
    detalles = db.query(DetalleDocumento).filter(DetalleDocumento.documento_id == documento_id).all()
    total = sum((d.precio or 0) * (d.cantidad or 0) for d in detalles)
    documento_obj = db.query(Documento).filter(Documento.id == documento_id).first()
    if documento_obj:
        documento_obj.monto_total = float(total)
        db.add(documento_obj)
        db.commit()
        db.refresh(documento_obj)

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
    ).order_by(DetalleDocumento.fecha_creacion).all()
    
    return detalles

@app.get("/documentos/{documento_id}/pdf")
def get_documento_pdf(
    documento_id: UUID,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Descargar PDF del documento"""
    documento = db.query(Documento).filter(
        Documento.id == documento_id,
        Documento.usuario_id == current_user.id
    ).first()
    
    if not documento:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    if not documento.ruta_documento:
        raise HTTPException(
            status_code=404,
            detail="PDF no disponible para este documento"
        )
    
    # Construir ruta completa del archivo
    base_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "documents"
    )
    ruta_completa = os.path.join(base_path, documento.ruta_documento)
    
    # Normalizar separadores
    ruta_completa = os.path.normpath(ruta_completa)
    
    if not os.path.exists(ruta_completa):
        raise HTTPException(
            status_code=404,
            detail="Archivo PDF no encontrado en el servidor"
        )
    
    return FileResponse(
        ruta_completa,
        media_type="application/pdf",
        filename=f"comprobante_{documento_id}.pdf"
    )

# ==================== CHECKOUT ENDPOINT ====================

def _cargar_productos() -> Dict[int, Dict[str, Any]]:
    """Cargar productos desde JSON"""
    productos = {}
    
    # Intentar múltiples rutas posibles
    posibles_rutas = [
        # Ruta relativa desde el backend (desarrollo local)
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "frontend", "public", "data", "productos.json"
        ),
        # Ruta absoluta desde el directorio actual
        os.path.join(os.getcwd(), "frontend", "public", "data", "productos.json"),
        # Ruta desde el directorio padre
        os.path.join(os.path.dirname(os.getcwd()), "frontend", "public", "data", "productos.json"),
        # Ruta en Docker (si está montado)
        "/app/frontend/public/data/productos.json",
    ]
    
    for productos_path in posibles_rutas:
        try:
            productos_path = os.path.normpath(productos_path)
            if os.path.exists(productos_path):
                with open(productos_path, 'r', encoding='utf-8') as f:
                    productos_list = json.load(f)
                    productos = {p['id']: p for p in productos_list}
                    print(f"Productos cargados desde: {productos_path}")
                    break
        except Exception as e:
            print(f"Error al cargar productos desde {productos_path}: {e}")
            continue
    
    if not productos:
        print("Advertencia: No se pudieron cargar productos desde ningún archivo")
    
    return productos

def _cargar_metodos_envio() -> Dict[int, Dict[str, Any]]:
    """Cargar métodos de envío desde JSON"""
    envios = {}
    
    # Intentar múltiples rutas posibles
    posibles_rutas = [
        # Ruta relativa desde el backend (desarrollo local)
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "frontend", "public", "data", "envios.json"
        ),
        # Ruta absoluta desde el directorio actual
        os.path.join(os.getcwd(), "frontend", "public", "data", "envios.json"),
        # Ruta desde el directorio padre
        os.path.join(os.path.dirname(os.getcwd()), "frontend", "public", "data", "envios.json"),
        # Ruta en Docker (si está montado)
        "/app/frontend/public/data/envios.json",
    ]
    
    for envios_path in posibles_rutas:
        try:
            envios_path = os.path.normpath(envios_path)
            if os.path.exists(envios_path):
                with open(envios_path, 'r', encoding='utf-8') as f:
                    envios_list = json.load(f)
                    envios = {e['id']: e for e in envios_list}
                    print(f"Métodos de envío cargados desde: {envios_path}")
                    break
        except Exception as e:
            print(f"Error al cargar métodos de envío desde {envios_path}: {e}")
            continue
    
    if not envios:
        print("Advertencia: No se pudieron cargar métodos de envío desde ningún archivo")
        # Datos por defecto si no se encuentra el archivo
        envios = {
            1: {"id": 1, "nombre": "Envío Estándar UNAB", "precio": 5.0},
            2: {"id": 2, "nombre": "Envío Express UNAB", "precio": 12.0},
            3: {"id": 3, "nombre": "Envío Premium UNAB", "precio": 25.0},
            4: {"id": 4, "nombre": "Retiro en Campus UNAB", "precio": 0.0},
        }
    
    return envios

@app.post("/checkout", response_model=DocumentoResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Procesar checkout y crear compra"""
    errors = {}
    
    # Validar RUT
    es_valido, resultado = validar_rut_chileno(checkout_data.rut)
    if not es_valido:
        errors["rut"] = resultado
    else:
        checkout_data.rut = resultado
    
    # Validar teléfono
    es_valido, resultado = validar_telefono_chileno(checkout_data.telefono)
    if not es_valido:
        errors["telefono"] = resultado
    else:
        checkout_data.telefono = resultado
    
    # Validar método de envío
    metodos_envio = _cargar_metodos_envio()
    if not metodos_envio:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudieron cargar los métodos de envío. Verifique que el archivo envios.json existe."
        )
    if checkout_data.metodo_envio_id not in metodos_envio:
        errors["metodo_envio_id"] = f"Método de envío {checkout_data.metodo_envio_id} no disponible. Métodos disponibles: {list(metodos_envio.keys())}"
    else:
        metodo_envio = metodos_envio[checkout_data.metodo_envio_id]
    
    # Validar productos y stock
    productos_data = _cargar_productos()
    if not productos_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudieron cargar los productos. Verifique que el archivo productos.json existe."
        )
    productos_validos = []
    subtotal = 0.0
    
    for producto_checkout in checkout_data.productos:
        producto_id = producto_checkout.producto_id
        
        if producto_id not in productos_data:
            errors[f"producto_{producto_id}"] = f"Producto {producto_id} no encontrado"
            continue
        
        producto = productos_data[producto_id]
        stock_disponible = producto.get('stock', 0)
        
        if producto_checkout.cantidad > stock_disponible:
            errors[f"producto_{producto_id}"] = (
                f"Stock insuficiente. Disponible: {stock_disponible}, "
                f"Solicitado: {producto_checkout.cantidad}"
            )
            continue
        
        # Validar que el precio coincida (o usar el precio del producto)
        precio_final = producto.get('precio', producto_checkout.precio)
        productos_validos.append({
            'producto_id': producto_id,
            'nombre': producto.get('nombre', f'Producto {producto_id}'),
            'cantidad': producto_checkout.cantidad,
            'precio': precio_final,
            'producto_completo': producto  # Guardar toda la información del producto
        })
        subtotal += precio_final * producto_checkout.cantidad
    
    # Si hay errores, retornarlos
    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=errors
        )
    
    # Calcular costo de envío
    costo_envio = metodo_envio.get('precio', 0.0)
    monto_total = subtotal + costo_envio
    
    # Crear documento (compra)
    db_documento = Documento(
        usuario_id=current_user.id,
        estado="completado",
        monto_total=monto_total,
    )
    
    # Guardar dirección de envío en metadata
    db_documento.metadata_json = {
        "rut": checkout_data.rut,
        "email": checkout_data.email,
        "telefono": checkout_data.telefono,
        "direccion": checkout_data.direccion.model_dump(),
        "metodo_envio": metodo_envio,
        "costo_envio": costo_envio,
        "subtotal": subtotal
    }
    
    db.add(db_documento)
    db.commit()
    db.refresh(db_documento)
    
    # Crear detalles del documento
    for producto_info in productos_validos:
        # Guardar todas las características del producto en metadata
        producto_completo = producto_info.get('producto_completo', {})
        metadata_producto = {
            'id': producto_info['producto_id'],
            'nombre': producto_info['nombre'],
            'descripcion': producto_completo.get('descripcion'),
            'categoria': producto_completo.get('categoria'),
            'stock': producto_completo.get('stock'),
            'rating': producto_completo.get('rating'),
            'imagenes': producto_completo.get('imagenes'),
            'caracteristicas': producto_completo.get('caracteristicas'),
            # Incluir cualquier otro campo que pueda tener el producto
            **{k: v for k, v in producto_completo.items() 
               if k not in ['id', 'nombre', 'precio', 'stock']}
        }
        
        db_detalle = DetalleDocumento(
            documento_id=db_documento.id,
            producto=producto_info['nombre'],
            precio=producto_info['precio'],
            cantidad=producto_info['cantidad'],
            metadata_json=metadata_producto
        )
        db.add(db_detalle)
    
    db.commit()
    db.refresh(db_documento)
    
    # Generar PDF del documento
    try:
        detalles_lista = db.query(DetalleDocumento).filter(
            DetalleDocumento.documento_id == db_documento.id
        ).all()
        
        ruta_pdf = generar_pdf_documento(
            documento=db_documento,
            usuario=current_user,
            detalles=detalles_lista
        )
        
        # Actualizar ruta del documento
        db_documento.ruta_documento = ruta_pdf
        db.commit()
        db.refresh(db_documento)
    except Exception as e:
        # Si falla la generación del PDF, no fallar el checkout
        # Solo registrar el error (en producción usar logging)
        print(f"Error generando PDF: {e}")
    
    return db_documento

# ==================== HEALTH CHECK ====================

@app.get("/")
def root():
    """Health check"""
    return {
        "status": "ok",
        "message": "API funcionando correctamente",
        "version": "1.0.0"
    }