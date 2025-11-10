FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puertos (dev server + SSR server)
EXPOSE 5173 5174

# Ejecutar ambos servidores en paralelo
CMD ["sh", "-c", "npm run dev & npm run ssr:dev"]