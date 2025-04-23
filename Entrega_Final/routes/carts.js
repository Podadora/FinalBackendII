import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorize.js";
import { processPurchase } from "../services/purchase.service.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import User from "../models/user.js";

const router = Router();

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
    try {
        const cart = await CartRepository.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.post("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user.cart) {
            return res.status(400).json({ error: "Ya tenés un carrito asignado" });
        }

        const newCart = await CartRepository.createCart();
        user.cart = newCart._id;
        await user.save();

        res.status(201).json({ message: "Carrito creado y asignado al usuario", cart: newCart });

    } catch (error) {
        res.status(500).json({ error: "Error al crear carrito" });
    }
});

// POST /api/carts/:cid/products/:pid (solo user)
router.post(
    "/:cid/products/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("user"),
    async (req, res) => {
        try {
            const product = await ProductRepository.getProductById(req.params.pid);
            if (!product) return res.status(404).json({ error: "Producto no encontrado" });

            const cart = await CartRepository.addProductToCart(req.params.cid, req.params.pid, 1);
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: "Error al agregar producto al carrito" });
        }
    }
);

// DELETE /api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await CartRepository.removeProduct(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});

// DELETE /api/carts/:cid
router.delete("/:cid", async (req, res) => {
    try {
        const cart = await CartRepository.clearCart(req.params.cid);
        res.json({ message: "Carrito vaciado", cart });
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
});

// PUT /api/carts/:cid
router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "Formato inválido de productos" });
        }

        const updated = await CartRepository.updateCart(req.params.cid, { products });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

// POST /api/carts/:cid/purchase
router.post(
    "/:cid/purchase",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("user"),
    async (req, res) => {
        try {
            const purchaserEmail = req.user.email;
            const { cid } = req.params;

            const result = await processPurchase(cid, purchaserEmail);

            if (!result.success) {
                return res.status(400).json({
                    message: result.message,
                    unprocessed: result.unprocessed,
                });
            }

            // Limpiar referencia del carrito en el usuario después de la compra
            const user = await User.findOne({ email: purchaserEmail });
            if (user) {
                user.cart = null;
                await user.save();
            }

            res.json({
                message: "Compra realizada con éxito",
                ticket: result.ticket,
                productosNoProcesados: result.unprocessed,
            });

        } catch (error) {
            console.error("Error al procesar compra:", error);
            res.status(500).json({ error: "Error interno al procesar la compra" });
        }
    }
);

export default router;