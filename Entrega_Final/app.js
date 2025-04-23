import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser"; // Key para leer la cookie con el JWT

// Routers
import viewsRouter from "./routes/views.js";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import sessionsRouter from "./routes/sessions.js"; //Ruta de sesiones

// Models
import Cart from "./models/cart.js";

// Passport
import passport from "passport";
import initializePassport from "./config/passport.js"; 

import dotenv from 'dotenv';

dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(async () => {
    console.log("Conectado a MongoDB");

    // Si no hay carrito, se crea uno por defecto
    const existingCart = await Cart.findOne();
    if (!existingCart) {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        global.defaultCartId = newCart._id.toString();
    } else {
        global.defaultCartId = existingCart._id.toString();
    }
})
.catch((err) => console.error("Error al conectar a MongoDB:", err));

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Inicializar Passport
initializePassport(); 
app.use(passport.initialize());

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter); //Rutas de login, registro y current

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});