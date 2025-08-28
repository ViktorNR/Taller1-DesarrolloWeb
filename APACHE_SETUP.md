# Configuración de Apache para Mini-Marketplace

## 🚀 Configuración Rápida con XAMPP

### 1. Instalación de XAMPP

1. **Descargar XAMPP** desde [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. **Instalar** siguiendo el asistente (mantener configuración por defecto)
3. **Iniciar XAMPP Control Panel**

### 2. Configurar el Proyecto

1. **Copiar el proyecto** a la carpeta `htdocs`:
   ```
   C:\xampp\htdocs\Taller1-DesarrolloWeb\
   ```

2. **Iniciar Apache** desde XAMPP Control Panel:
   - Hacer clic en "Start" junto a Apache
   - Esperar que el estado cambie a verde

3. **Acceder a la aplicación**:
   - Abrir navegador
   - Ir a: `http://localhost/Taller1-DesarrolloWeb/`

## 🔧 Configuración Manual de Apache

### Archivo de Configuración Principal

Si usas Apache manual, agrega esto a tu `httpd.conf`:

```apache
# Habilitar módulos necesarios
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so

# Configuración para el proyecto
<Directory "C:/ruta/a/tu/proyecto">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    
    # Headers de seguridad
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</Directory>
```

### Archivo .htaccess (opcional)

Crear `.htaccess` en la raíz del proyecto:

```apache
# Habilitar CORS para desarrollo
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"

# Configuración de caché para archivos estáticos
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Configuración de seguridad
<Files "*.json">
    Require all granted
</Files>

# Redirección de errores
ErrorDocument 404 /index.html
```

## 🌐 Configuración de Virtual Host (Opcional)

Para un dominio personalizado, crear en `httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName marketplace.local
    DocumentRoot "C:/xampp/htdocs/Taller1-DesarrolloWeb"
    
    <Directory "C:/xampp/htdocs/Taller1-DesarrolloWeb">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog "logs/marketplace-error.log"
    CustomLog "logs/marketplace-access.log" combined
</VirtualHost>
```

Luego agregar a `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 marketplace.local
```

## 🐛 Solución de Problemas Comunes

### Error: "Apache no puede iniciar"

**Puerto 80 ocupado:**
```bash
# Ver qué proceso usa el puerto 80
netstat -ano | findstr :80

# Cambiar puerto en httpd.conf
Listen 8080
```

**Permisos insuficientes:**
- Ejecutar XAMPP como administrador
- Verificar permisos de carpeta htdocs

### Error: "No se pueden cargar los datos JSON"

**Verificar rutas:**
- Confirmar que los archivos estén en `data/`
- Verificar permisos de lectura
- Revisar consola del navegador

**Problemas de CORS:**
- Usar `http://localhost/` no `file://`
- Verificar que Apache esté ejecutándose

### Error: "Módulo no encontrado"

**Habilitar módulos en httpd.conf:**
```apache
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
```

## 📱 Configuración para Desarrollo Móvil

### Acceso desde dispositivos móviles

1. **Obtener IP local**:
   ```bash
   ipconfig
   ```

2. **Configurar firewall** para permitir conexiones al puerto 80/8080

3. **Acceder desde móvil**:
   ```
   http://192.168.1.XXX/Taller1-DesarrolloWeb/
   ```

### Configuración de red

```apache
# Permitir acceso desde red local
<Directory "C:/xampp/htdocs">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    Require ip 127.0.0.1
    Require ip ::1
    Require ip 192.168.1.0/24
</Directory>
```

## 🔒 Configuración de Seguridad

### Headers de Seguridad

```apache
# En .htaccess o httpd.conf
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=()"
```

### Restricción de Acceso

```apache
# Bloquear acceso a archivos sensibles
<FilesMatch "\.(htaccess|htpasswd|ini|log|sh|sql|conf)$">
    Require all denied
</FilesMatch>

# Permitir solo archivos necesarios
<Files "*.json">
    Require all granted
</Files>
```

## 📊 Monitoreo y Logs

### Habilitar Logs

```apache
# En httpd.conf
LogLevel warn
ErrorLog "logs/error.log"
CustomLog "logs/access.log" combined
```

### Logs Personalizados

```apache
# Para el proyecto específico
CustomLog "logs/marketplace-access.log" combined
ErrorLog "logs/marketplace-error.log"
```

## 🚀 Optimización de Performance

### Compresión Gzip

```apache
# Habilitar compresión
LoadModule deflate_module modules/mod_deflate.so

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### Caché de Navegador

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

## ✅ Checklist de Verificación

- [ ] Apache iniciado correctamente
- [ ] Proyecto copiado a htdocs
- [ ] Acceso a `http://localhost/Taller1-DesarrolloWeb/`
- [ ] Datos JSON cargando correctamente
- [ ] Funcionalidades del marketplace funcionando
- [ ] Responsive design en diferentes dispositivos
- [ ] Logs configurados y funcionando
- [ ] Seguridad básica implementada

## 📞 Soporte Adicional

Si encuentras problemas específicos:

1. **Revisar logs** de Apache en `logs/error.log`
2. **Verificar consola** del navegador (F12)
3. **Comprobar permisos** de archivos y carpetas
4. **Revisar configuración** de firewall y antivirus

---

**¡Con esta configuración tu Mini-Marketplace debería funcionar perfectamente! 🎉**
