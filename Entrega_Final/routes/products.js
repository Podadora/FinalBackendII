import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/authorize.js";
import ProductRepository from "../repositories/product.repository.js";

const router = Router();

// GET /api/products - Obtener productos con filtros y paginación
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = query ? { category: query } : {};
        const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
        };

        const products = await ProductRepository.getAllProducts(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
        });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

// GET /api/products/:pid - Obtener por ID
router.get("/:pid", async (req, res) => {
    try {
        const product = await ProductRepository.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

// POST /api/products - Crear productos (solo admin)
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            let products = Array.isArray(req.body) ? req.body : [req.body];

            for (let product of products) {
                const { title, description, code, price, stock, category } = product;
                if (!title || !description || !code || !price || !stock || !category) {
                    return res.status(400).json({ error: "Faltan campos obligatorios" });
                }

                const exists = await ProductRepository.getAllProducts({ code }, {});
                if (exists.totalDocs > 0) {
                    return res.status(400).json({ error: `El código ${product.code} ya existe` });
                }
            }

            const created = await Promise.all(
                products.map(p => ProductRepository.createProduct(p))
            );

            res.status(201).json({ message: "Productos agregados", products: created });
        } catch (error) {
            res.status(500).json({ error: "Error al agregar productos" });
        }
    }
);

// PUT /api/products/:pid - Actualizar (solo admin)
router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const updated = await ProductRepository.updateProduct(req.params.pid, req.body);
            if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
            res.json(updated);
        } catch (error) {
            res.status(500).json({ error: "Error al actualizar producto" });
        }
    }
);

// DELETE /api/products/:pid - Eliminar (solo admin)
router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    async (req, res) => {
        try {
            const deleted = await ProductRepository.deleteProduct(req.params.pid);
            if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
            res.json({ message: "Producto eliminado" });
        } catch (error) {
            res.status(500).json({ error: "Error al eliminar producto" });
        }
    }
);

export default router;