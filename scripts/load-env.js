const fs = require('fs');
const path = require('path');

// Cargar variables de entorno desde .env
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  
  if (!fs.existsSync(envPath)) {
    console.warn('Archivo .env no encontrado, usando valores por defecto');
    return {};
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

// Generar contenido del archivo environment
function generateEnvironmentContent(envVars, isProduction = false) {
  return `export const environment = {
  production: ${isProduction},
  apiUrl: '${envVars.URL_API || 'https://dummyjson.com'}',
  nodeEnv: '${envVars.NODE_ENV || (isProduction ? 'production' : 'development')}'
};`;
}

// Cargar variables de entorno
const envVars = loadEnvFile();

// Generar archivos de environment
const environments = [
  { file: 'src/environments/environment.ts', isProduction: false },
  { file: 'src/environments/environment.development.ts', isProduction: false },
  { file: 'src/environments/environment.prod.ts', isProduction: true }
];

environments.forEach(({ file, isProduction }) => {
  const content = generateEnvironmentContent(envVars, isProduction);
  const filePath = path.join(__dirname, '..', file);
  
  // Crear directorio si no existe
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Generado: ${file}`);
});

console.log('🎉 Archivos de environment actualizados con variables de .env');
