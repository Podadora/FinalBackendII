import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { createHash, isValidPassword } from '../utils/hash.js';
import mongoose from "mongoose";


const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'El usuario ya existe' });

    //Asignar como admin segun correo electronico
    const role = email === "admin@admin.com" ? "admin" : "user";

    const newUser = new User({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !isValidPassword(user, password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user._id }, 'tu_clave_secreta', { expiresIn: '1h' });
    res.cookie('jwtCookie', token, { httpOnly: true }).json({ message: 'Login exitoso' });
});

import passport from 'passport';
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        status: "success",
        payload: req.user
    });
});

router.delete("/:uid", async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.uid);
        if (!result) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el usuario" });
    }
});

export default router;