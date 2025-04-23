#  Proyecto Ecommerce - Backend | Entrega Final

Este proyecto representa el backend de un ecommerce desarrollado en Node.js, utilizando Express, MongoDB y una arquitectura profesional con DAO, DTO, Repositories, autenticación con JWT y autorización con roles.

---

##  Tecnologías principales

- Node.js + Express
- MongoDB + Mongoose
- Passport + JWT
- Bcrypt (hash de contraseñas)
- dotenv (variables de entorno)
- Postman (para pruebas de endpoints)

---

##  Funcionalidades implementadas

###  Autenticación y Autorización

- ✅ Registro de usuarios (`POST /api/sessions/register`)
  - Contraseña hasheada con bcrypt
  - Asigna rol `user` por defecto (o `admin` si el email lo requiere)
  - Se crea un carrito automáticamente al registrarse

- ✅ Login con JWT (`POST /api/sessions/login`)
  - Verifica credenciales
  - Genera y guarda token en cookie `jwtCookie`

- ✅ Ruta protegida `/current` (`GET /api/sessions/current`)
  - Extrae el token desde la cookie y devuelve los datos del usuario autenticado (DTO)

- Middleware de autorización por rol (`authorizeRoles`)
  - Solo `admin` puede crear/editar/eliminar productos
  - Solo `user` puede agregar productos al carrito o realizar compras

---

## 🛒 Carrito

- ✅ Cada usuario tiene **1 solo carrito activo**
- ✅ El carrito se crea al registrarse
- ✅ Un nuevo carrito solo se puede crear si se borra o finaliza la compra del anterior

#### Endpoints principales

- GET /api/carts/:cid → Obtener carrito por ID
- POST /api/carts → Crear nuevo carrito (si no tiene uno)
- POST /api/carts/:cid/products/:pid → Agregar producto al carrito
- PUT /api/carts/:cid → Reemplazar productos del carrito
- DELETE /api/carts/:cid → Vaciar carrito
- DELETE /api/carts/:cid/products/:pid → Eliminar producto específico
- POST /api/carts/:cid/purchase → Finalizar compra y generar ticket

## 🛍️ Productos

- CRUD completo de productos
- Paginación, filtrado y ordenamiento (`GET /api/products`)
- Solo `admin` puede crear, actualizar o eliminar productos

#### Endpoints principales

- GET /api/products → Obtener productos con paginación
- GET /api/products/:pid → Obtener producto por ID
- POST /api/products → Crear producto (admin)
- PUT /api/products/:pid → Editar producto (admin)
- DELETE /api/products/:pid → Eliminar producto (admin)

## 🎟️ Tickets de compra

- Al finalizar una compra, se genera un ticket con:
  - Código único
  - Monto total
  - Fecha de compra
  - Email del comprador

-  Los productos sin stock suficiente no se procesan
-  El carrito del usuario se limpia automáticamente después de la compra
