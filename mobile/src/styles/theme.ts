// Colores UNAB - Identidad Visual Institucional
export const UNAB_COLORS = {
  AZUL: '#002B5C',
  ROJO: '#C8102E',
  ROJO_OSCURO: '#A60D25',
  BLANCO: '#FFFFFF',
  GRIS_CLARO: '#F5F5F5',
  GRIS: '#6C757D',
  GRIS_OSCURO: '#495057',
  AZUL_CLARO: '#E3F2FD',
  ROJO_CLARO: '#FFEBEE',
  VERDE: '#28A745',
  AMARILLO: '#FFC107',
  NARANJA: '#FD7E14',
};

// Tipografía
export const TYPOGRAPHY = {
  FONT_FAMILY: 'System', // Open Sans o Roboto en producción
  SIZES: {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 18,
    XXLARGE: 24,
    TITLE: 28,
  },
  WEIGHTS: {
    LIGHT: '300' as const,
    REGULAR: '400' as const,
    MEDIUM: '500' as const,
    SEMIBOLD: '600' as const,
    BOLD: '700' as const,
  },
};

// Espaciado
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

// Bordes
export const BORDER_RADIUS = {
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
  XLARGE: 20,
  ROUND: 999,
};

// Sombras
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

