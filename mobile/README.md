# Mini Marketplace UNAB - Mobile App

Aplicación móvil React Native con Expo SDK 54 y EAS para el Mini Marketplace UNAB.

## Requisitos

- Node.js 18+ 
- npm o yarn
- Expo CLI (opcional, se puede usar npx)

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
Crear archivo `.env` con:
```
API_URL=http://localhost:8000
```

3. Ejecutar en desarrollo:
```bash
npm start
# o
npx expo start
```

## Builds con EAS

### Desarrollo
```bash
eas build --profile development --platform android
```

### Preview
```bash
eas build --profile preview --platform android
```

### Producción
```bash
eas build --profile production --platform android
```

## Versiones

- **Expo SDK**: 54.0.0
- **React**: 19.1.0
- **React Native**: 0.81.0

## Estructura del Proyecto

- `src/` - Código fuente
  - `api/` - Llamadas a la API
  - `components/` - Componentes reutilizables
  - `context/` - Contextos de React
  - `navigation/` - Configuración de navegación
  - `screens/` - Pantallas de la aplicación
  - `styles/` - Estilos y tema

## Notas

- La aplicación usa AsyncStorage para persistencia local
- React Navigation para navegación
- Colores UNAB definidos en `src/styles/theme.ts`
- Todas las funcionalidades del frontend web están migradas
