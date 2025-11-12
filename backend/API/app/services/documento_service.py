"""
Servicio para generación de documentos PDF de compras
"""
import os
from datetime import datetime
from pathlib import Path
from typing import Optional
from uuid import UUID

try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib import colors
    from reportlab.lib.units import cm
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

from sqlalchemy.orm import Session

from ..models import Documento, DetalleDocumento, Usuario


def generar_pdf_documento(
    documento: Documento,
    usuario: Usuario,
    detalles: list[DetalleDocumento],
    base_path: Optional[str] = None
) -> str:
    """
    Genera un PDF del documento de compra y retorna la ruta del archivo.
    
    Args:
        documento: Documento de compra
        usuario: Usuario propietario del documento
        detalles: Lista de detalles del documento
        base_path: Ruta base para guardar documentos (opcional)
    
    Returns:
        str: Ruta relativa del archivo PDF generado
    """
    if not REPORTLAB_AVAILABLE:
        raise RuntimeError("reportlab no está instalado. Instálelo con: pip install reportlab")
    
    # Determinar ruta base
    if base_path is None:
        base_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "documents"
        )
    
    # Crear estructura de carpetas por fecha
    fecha = documento.fecha_creacion.date()
    carpeta_fecha = os.path.join(
        base_path,
        str(fecha.year),
        f"{fecha.month:02d}",
        f"{fecha.day:02d}"
    )
    Path(carpeta_fecha).mkdir(parents=True, exist_ok=True)
    
    # Nombre del archivo
    nombre_archivo = f"{documento.id}.pdf"
    ruta_completa = os.path.join(carpeta_fecha, nombre_archivo)
    
    # Crear documento PDF
    doc = SimpleDocTemplate(ruta_completa, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Estilos personalizados
    titulo_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=colors.HexColor('#002B5C'),  # Azul UNAB
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    subtitulo_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#666666'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    # Encabezado
    story.append(Paragraph("COMPROBANTE DE COMPRA", titulo_style))
    story.append(Paragraph("Universidad Andrés Bello", subtitulo_style))
    story.append(Spacer(1, 0.5*cm))
    
    # Información del documento
    info_data = [
        ['Número de Compra:', str(documento.id)],
        ['Fecha:', documento.fecha_creacion.strftime('%d/%m/%Y %H:%M:%S')],
        ['Estado:', documento.estado.upper()],
    ]
    
    info_table = Table(info_data, colWidths=[5*cm, 10*cm])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F5F5F5')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Datos del comprador
    story.append(Paragraph("<b>DATOS DEL COMPRADOR</b>", styles['Heading2']))
    comprador_data = [
        ['Nombre:', f"{usuario.nombre or ''} {usuario.apellido or ''}".strip() or 'N/A'],
        ['Email:', usuario.email],
    ]
    
    # Agregar RUT y teléfono si están disponibles
    if usuario.rut:
        comprador_data.append(['RUT:', usuario.rut])
    if usuario.telefono:
        comprador_data.append(['Teléfono:', usuario.telefono])
    
    comprador_table = Table(comprador_data, colWidths=[5*cm, 10*cm])
    comprador_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F5F5F5')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    story.append(comprador_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Información de envío desde metadata
    if documento.metadata_json:
        metadata = documento.metadata_json
        if 'direccion' in metadata or 'metodo_envio' in metadata:
            story.append(Paragraph("<b>INFORMACIÓN DE ENVÍO</b>", styles['Heading2']))
            envio_data = []
            
            if 'direccion' in metadata:
                direccion = metadata['direccion']
                envio_data.append(['Dirección:', direccion.get('direccion', 'N/A')])
                if direccion.get('comuna'):
                    envio_data.append(['Comuna:', direccion['comuna']])
                if direccion.get('ciudad'):
                    envio_data.append(['Ciudad:', direccion['ciudad']])
                if direccion.get('codigo_postal'):
                    envio_data.append(['Código Postal:', direccion['codigo_postal']])
            
            if 'metodo_envio' in metadata:
                metodo = metadata['metodo_envio']
                envio_data.append(['Método de Envío:', metodo.get('nombre', 'N/A')])
                if metodo.get('tiempo'):
                    envio_data.append(['Tiempo Estimado:', metodo['tiempo']])
            
            if envio_data:
                envio_table = Table(envio_data, colWidths=[5*cm, 10*cm])
                envio_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F5F5F5')),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('TOPPADDING', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ]))
                story.append(envio_table)
                story.append(Spacer(1, 0.5*cm))
    
    # Detalle de productos
    story.append(Paragraph("<b>DETALLE DE PRODUCTOS</b>", styles['Heading2']))
    
    # Encabezados de tabla
    detalle_headers = ['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']
    detalle_data = [detalle_headers]
    
    # Agregar productos
    for detalle in detalles:
        subtotal = (detalle.precio or 0) * (detalle.cantidad or 0)
        detalle_data.append([
            detalle.producto,
            str(detalle.cantidad or 0),
            f"${detalle.precio:,.0f}" if detalle.precio else "$0",
            f"${subtotal:,.0f}"
        ])
    
    # Crear tabla de detalles
    detalle_table = Table(detalle_data, colWidths=[8*cm, 2*cm, 3*cm, 2*cm])
    detalle_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#002B5C')),  # Azul UNAB
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(detalle_table)
    story.append(Spacer(1, 0.5*cm))
    
    # Totales
    subtotal_productos = sum((d.precio or 0) * (d.cantidad or 0) for d in detalles)
    costo_envio = documento.metadata_json.get('costo_envio', 0) if documento.metadata_json else 0
    total = documento.monto_total
    
    totales_data = [
        ['Subtotal Productos:', f"${subtotal_productos:,.0f}"],
        ['Costo de Envío:', f"${costo_envio:,.0f}"],
        ['TOTAL:', f"${total:,.0f}"],
    ]
    
    totales_table = Table(totales_data, colWidths=[10*cm, 5*cm])
    totales_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 12),
        ('FONTSIZE', (0, 0), (0, -2), 10),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#C8102E')),  # Rojo UNAB
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, -2), (-1, -2), 1, colors.grey),
    ]))
    story.append(totales_table)
    story.append(Spacer(1, 1*cm))
    
    # Pie de página
    pie_text = """
    <para align="center">
    <b>Universidad Andrés Bello</b><br/>
    Gracias por su compra<br/>
    Para consultas: contacto@unab.cl<br/>
    <i>Este es un comprobante de compra, no constituye una factura tributaria.</i>
    </para>
    """
    story.append(Paragraph(pie_text, styles['Normal']))
    
    # Construir PDF
    doc.build(story)
    
    # Retornar ruta relativa desde base_path
    ruta_relativa = os.path.relpath(ruta_completa, base_path)
    # Normalizar separadores para que funcione en cualquier OS
    ruta_relativa = ruta_relativa.replace('\\', '/')
    
    return ruta_relativa


