# 🛍️ Sistema de Tienda de Ropa Online

Sistema completo de e-commerce para una tienda de ropa desarrollado con Node.js, Express, React, SQLite y TypeScript.

## 📋 Características

### Frontend
- ✨ Interfaz moderna y responsiva con React + TypeScript
- 🎨 Diseño atractivo con CSS personalizado
- 🔐 Sistema de autenticación (Login/Registro)
- 🛒 Carrito de compras con persistencia en LocalStorage
- 📦 Catálogo de productos con filtros por categoría
- 🔍 Búsqueda de productos
- 📱 Diseño totalmente responsive
- 👤 Perfil de usuario con historial de pedidos
- 💳 Sistema de checkout
- 🎯 Productos destacados en página principal
- 👨‍💼 Panel de administración completo

### Backend
- 🚀 API REST con Node.js y Express
- 🔒 Autenticación JWT
- 📊 Base de datos SQLite con Sequelize ORM
- 🔐 Hash de contraseñas con bcrypt
- ✅ Validación de datos
- 🎭 Manejo de roles (cliente/admin)
- 📝 CRUD completo de productos
- 📦 Gestión de pedidos
- 🔄 Estados de pedido (pendiente, procesando, enviado, entregado, cancelado)

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- React Router DOM
- Axios
- React Icons
- Vite

### Backend
- Node.js
- Express
- TypeScript
- SQLite
- Sequelize ORM
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

## 📁 Estructura del Proyecto

```
ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── productoController.ts
│   │   │   └── pedidoController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Producto.ts
│   │   │   └── Pedido.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── productoRoutes.ts
│   │   │   └── pedidoRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── ProductCard.tsx
    │   │   └── CartItem.tsx
    │   ├── context/
    │   │   ├── AuthContext.tsx
    │   │   └── CarritoContext.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Products.tsx
    │   │   ├── ProductDetail.tsx
    │   │   ├── Cart.tsx
    │   │   ├── Checkout.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Profile.tsx
    │   │   └── Admin.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── styles/
    │   │   └── main.css
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

**Nota:** Ya no necesitas instalar MongoDB. El proyecto usa SQLite, que se crea automáticamente como un archivo local.

### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd ecommerce
```

### Paso 2: Configurar Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus configuraciones
# PORT=5000
# DB_PATH=./database.sqlite
# JWT_SECRET=tu_clave_secreta_muy_segura
# NODE_ENV=development
```

### Paso 3: Configurar Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Opcional: crear archivo .env si necesitas configurar la URL de la API
# VITE_API_URL=http://localhost:5000/api
```

## 🎮 Uso

### Iniciar el Backend

```bash
cd backend

# Modo desarrollo (con hot-reload)
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

El servidor estará disponible en `http://localhost:5000`

### Iniciar el Frontend

```bash
cd frontend

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 API Endpoints

### Autenticación
- `POST /api/auth/registrar` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/perfil` - Obtener perfil del usuario (requiere autenticación)

### Productos
- `GET /api/productos` - Obtener todos los productos (con filtros opcionales)
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto (requiere admin)
- `PUT /api/productos/:id` - Actualizar producto (requiere admin)
- `DELETE /api/productos/:id` - Eliminar producto (requiere admin)

### Pedidos
- `POST /api/pedidos` - Crear nuevo pedido (requiere autenticación)
- `GET /api/pedidos/mis-pedidos` - Obtener pedidos del usuario (requiere autenticación)
- `GET /api/pedidos/:id` - Obtener pedido por ID (requiere autenticación)
- `GET /api/pedidos/todos` - Obtener todos los pedidos (requiere admin)
- `PUT /api/pedidos/:id/estado` - Actualizar estado de pedido (requiere admin)

## 👥 Roles de Usuario

### Cliente
- Ver productos
- Agregar productos al carrito
- Realizar pedidos
- Ver historial de pedidos
- Gestionar perfil

### Administrador
- Todas las funcionalidades de cliente
- Crear, editar y eliminar productos
- Ver todos los pedidos
- Actualizar estados de pedidos
- Acceso al panel de administración

## 📝 Crear Usuario Administrador

**Opción 1:** Al registrar, envía el rol en el body (nota: en producción, esto debería estar protegido):

```json
{
  "nombre": "Admin",
  "email": "admin@example.com",
  "password": "contraseña123",
  "rol": "admin"
}
```

**Opción 2:** Actualizar directamente en la base de datos SQLite usando cualquier cliente SQLite (como [DB Browser for SQLite](https://sqlitebrowser.org/)):

```sql
UPDATE users SET rol = 'admin' WHERE email = 'admin@example.com';
```

## 🎨 Características de la Interfaz

- **Página Principal**: Hero section, categorías y productos destacados
- **Catálogo**: Grid de productos con filtros por categoría y búsqueda
- **Detalle de Producto**: Galería de imágenes, selección de talla/color, agregar al carrito
- **Carrito**: Vista de items, actualizar cantidades, eliminar productos
- **Checkout**: Formulario de dirección de envío y método de pago
- **Perfil**: Información del usuario e historial de pedidos
- **Panel Admin**: Gestión de productos y pedidos con tablas y formularios

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación mediante JWT
- Protección de rutas en frontend y backend
- Validación de datos
- Manejo de errores apropiado
- CORS configurado

## 🐛 Solución de Problemas

### Base de datos
La base de datos SQLite se crea automáticamente la primera vez que ejecutas el servidor. El archivo `database.sqlite` se generará en la carpeta `backend/` (o en la ubicación especificada en `DB_PATH`).

Si necesitas resetear la base de datos, simplemente elimina el archivo `database.sqlite` y se volverá a crear cuando inicies el servidor.

### Puerto en uso
Si el puerto 5000 o 3000 ya está en uso, puedes cambiarlos en:
- Backend: archivo `.env` (PORT=5000)
- Frontend: archivo `vite.config.ts` (server.port)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado con por el equipo de desarrollo

---

¡Disfruta del sistema de tienda de ropa online! 🎉
