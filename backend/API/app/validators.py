"""
Funciones de validación para el sistema de e-commerce UNAB
Incluye validaciones de RUT chileno, teléfono y contraseña
"""
import re
from typing import Tuple


def validar_rut_chileno(rut: str) -> Tuple[bool, str]:
    """
    Valida el formato y dígito verificador de un RUT chileno.
    
    Args:
        rut: RUT en formato string (acepta con/sin puntos, con/sin guion)
    
    Returns:
        Tuple[bool, str]: (es_valido, mensaje_error)
        Si es válido: (True, rut_normalizado)
        Si es inválido: (False, mensaje_de_error)
    """
    if not rut:
        return False, "RUT no puede estar vacío"
    
    # Limpiar el RUT: quitar puntos y espacios, convertir a mayúsculas
    rut_limpio = re.sub(r'[.\s]', '', rut.strip().upper())
    
    # Separar número y dígito verificador
    if '-' in rut_limpio:
        partes = rut_limpio.split('-')
        if len(partes) != 2:
            return False, "Formato de RUT inválido"
        numero_str, dv = partes
    else:
        # Si no tiene guion, el último carácter es el dígito verificador
        if len(rut_limpio) < 2:
            return False, "RUT demasiado corto"
        numero_str = rut_limpio[:-1]
        dv = rut_limpio[-1]
    
    # Validar que el número solo contenga dígitos
    if not numero_str.isdigit():
        return False, "El número del RUT solo puede contener dígitos"
    
    # Validar dígito verificador (puede ser dígito o 'K')
    if dv not in '0123456789K':
        return False, "Dígito verificador inválido (debe ser un número o K)"
    
    # Convertir a entero para cálculo
    try:
        numero = int(numero_str)
    except ValueError:
        return False, "Número de RUT inválido"
    
    # Validar rango razonable (RUTs chilenos típicamente entre 1.000.000 y 99.999.999)
    if numero < 1000000 or numero > 99999999:
        return False, "Número de RUT fuera del rango válido"
    
    # Calcular dígito verificador esperado
    multiplicadores = [2, 3, 4, 5, 6, 7]
    suma = 0
    numero_reverso = numero_str[::-1]  # Invertir para multiplicar desde la derecha
    
    for i, digito in enumerate(numero_reverso):
        multiplicador = multiplicadores[i % len(multiplicadores)]
        suma += int(digito) * multiplicador
    
    resto = suma % 11
    dv_calculado = 11 - resto
    
    # Manejar casos especiales
    if dv_calculado == 11:
        dv_calculado = '0'
    elif dv_calculado == 10:
        dv_calculado = 'K'
    else:
        dv_calculado = str(dv_calculado)
    
    # Comparar dígito verificador
    if dv != dv_calculado:
        return False, f"Dígito verificador inválido. Esperado: {dv_calculado}"
    
    # Retornar RUT normalizado (con guion)
    rut_normalizado = f"{numero_str}-{dv}"
    return True, rut_normalizado


def validar_telefono_chileno(telefono: str) -> Tuple[bool, str]:
    """
    Valida y normaliza un número de teléfono chileno.
    
    Formatos aceptados:
    - +56912345678 (internacional con +)
    - 56912345678 (internacional sin +)
    - 912345678 (9 dígitos)
    - +56 9 1234 5678 (con espacios)
    
    Args:
        telefono: Número de teléfono en formato string
    
    Returns:
        Tuple[bool, str]: (es_valido, mensaje_error_o_telefono_normalizado)
        Si es válido: (True, telefono_normalizado)
        Si es inválido: (False, mensaje_de_error)
    """
    if not telefono:
        return False, "Teléfono no puede estar vacío"
    
    # Limpiar: quitar espacios, guiones, paréntesis
    telefono_limpio = re.sub(r'[\s\-\(\)]', '', telefono.strip())
    
    # Remover el + si existe
    if telefono_limpio.startswith('+'):
        telefono_limpio = telefono_limpio[1:]
    
    # Validar que solo contenga dígitos
    if not telefono_limpio.isdigit():
        return False, "El teléfono solo puede contener dígitos"
    
    # Normalizar según el formato
    if telefono_limpio.startswith('569'):
        # Formato internacional completo: 56912345678
        if len(telefono_limpio) == 11:
            telefono_normalizado = f"+{telefono_limpio}"
            return True, telefono_normalizado
        else:
            return False, "Teléfono con código de país debe tener 11 dígitos (569XXXXXXXX)"
    
    elif telefono_limpio.startswith('56'):
        # Formato internacional sin 9: 5612345678
        if len(telefono_limpio) == 10:
            telefono_normalizado = f"+{telefono_limpio}"
            return True, telefono_normalizado
        else:
            return False, "Teléfono con código de país debe tener 10 dígitos (56XXXXXXXX)"
    
    elif len(telefono_limpio) == 9:
        # Formato local: 912345678
        if telefono_limpio.startswith('9'):
            telefono_normalizado = f"+56{telefono_limpio}"
            return True, telefono_normalizado
        else:
            return False, "Teléfono local debe comenzar con 9"
    
    elif len(telefono_limpio) == 8:
        # Formato antiguo sin 9: 12345678
        telefono_normalizado = f"+569{telefono_limpio}"
        return True, telefono_normalizado
    
    else:
        return False, f"Longitud de teléfono inválida ({len(telefono_limpio)} dígitos). Debe tener 8, 9, 10 u 11 dígitos"


def validar_complejidad_password(password: str) -> Tuple[bool, str]:
    """
    Valida la complejidad de una contraseña.
    
    Requisitos:
    - Mínimo 8 caracteres
    - Al menos una mayúscula
    - Al menos una minúscula
    - Al menos un número
    
    Args:
        password: Contraseña a validar
    
    Returns:
        Tuple[bool, str]: (es_valido, mensaje_error)
        Si es válido: (True, "")
        Si es inválido: (False, mensaje_de_error)
    """
    if not password:
        return False, "La contraseña no puede estar vacía"
    
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres"
    
    if not re.search(r'[A-Z]', password):
        return False, "La contraseña debe contener al menos una letra mayúscula"
    
    if not re.search(r'[a-z]', password):
        return False, "La contraseña debe contener al menos una letra minúscula"
    
    if not re.search(r'\d', password):
        return False, "La contraseña debe contener al menos un número"
    
    return True, ""


