## ⚙️ Funcionalidades desarrolladas en esta entrega

<<<<<<< HEAD
Esta entrega implementa un sistema completo de **autenticación y autorización de usuarios** mediante **JWT**, **Passport** y **cookies**.

### Funciones principales:

✅ **Registro de usuarios** → `POST /api/sessions/register`  
Crea un nuevo usuario con contraseña encriptada utilizando **bcrypt**  
Valida que el email no exista previamente  
Asocia un carrito vacío al usuario y asigna el rol por defecto (`user`)  

✅ **Login con JWT** → `POST /api/sessions/login`  
Verifica credenciales con validación de contraseña hasheada  
Si son correctas, genera un **token JWT**  
Devuelve el token alojado en una **cookie segura** (`jwtCookie`)  

✅ **Ruta protegida `/current`** → `GET /api/sessions/current`  
Extrae el token JWT desde la cookie  
Autentica al usuario con estrategia **JWT** de Passport  
Devuelve los datos del usuario autenticado  

**Todas las rutas son testeables desde Postman**  
**Archivo Auth JWT Ecommerce.postman_collection para importar**  



```plaintext
=======
Funciones principales:
✅ Registro de usuarios → POST /api/sessions/register

Crea un nuevo usuario con contraseña encriptada utilizando bcrypt

Valida que el email no exista previamente

Asocia un carrito vacío al usuario y asigna el rol por defecto (user)

✅ Login con JWT → POST /api/sessions/login

Verifica credenciales con validación de contraseña hasheada

Si son correctas, genera un token JWT

Devuelve el token alojado en una cookie segura (jwtCookie)

✅ Ruta protegida /current → GET /api/sessions/current

Extrae el token JWT desde la cookie

Autentica al usuario con estrategia jwt de Passport

Devuelve los datos del usuario autenticado

💡 Todas las rutas son testeables desde Postman.
No es necesario contar con interfaz visual para esta entrega.

📁 Archivos relevantes para la entrega
⚠️ IMPORTANTE: Los archivos que no llevan el ícono ✅ no son requeridos para esta entrega, pero forman parte de la estructura general del proyecto.
No es necesario chequearlos para corregir.

├── config/
│   └── passport.js            ✅ Configuración de Passport con JWT
├── models/
│   ├── cart.js                Modelo de carrito
│   ├── product.js             Modelo de producto
│   └── user.js                ✅ Modelo de usuario con hashing y validaciones
├── routes/
│   ├── carts.js               Rutas de carritos
│   ├── products.js            Rutas de productos
│   ├── sessions.js            ✅ Rutas de autenticación y JWT
│   └── views.js               Rutas para vistas (no utilizadas en esta entrega)
├── utils/
│   └── hash.js                ✅ Funciones de hash y comparación de contraseñas
├── views/                     Vistas con Handlebars (no necesarias para esta entrega)
├── public/                    Archivos estáticos (no necesarios para esta entrega)
├── .gitignore
├── app.js                     ✅ App principal con configuración de rutas y middlewares
├── package.json
├── README.md
