import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketModel from "../models/ticket.js";
import { v4 as uuidv4 } from "uuid";

export const processPurchase = async (cartId, purchaserEmail) => {
    const cart = await CartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productsToBuy = [];
    const productsWithoutStock = [];
    let totalAmount = 0;

    for (const item of cart.products) {
        const product = await ProductRepository.getProductById(item.product._id);
        if (!product) continue;

        if (product.stock >= item.quantity) {
            // Hay stock: descontamos
            product.stock -= item.quantity;
            await ProductRepository.updateProduct(product._id, { stock: product.stock });

            totalAmount += product.price * item.quantity;
            productsToBuy.push(item.product._id);
        } else {
            // No hay stock suficiente
            productsWithoutStock.push(item);
        }
    }

    // Si no se pudo comprar nada
    if (productsToBuy.length === 0) {
        return {
            success: false,
            message: "No se pudo procesar ningún producto por falta de stock",
            unprocessed: cart.products.map(p => p.product._id)
        };
    }

    // Generar ticket
    const ticket = await TicketModel.create({
        code: uuidv4(), // código único
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: purchaserEmail
    });

    // Filtrar productos que no pudieron comprarse
    await CartRepository.updateCart(cartId, { products: productsWithoutStock });

    return {
        success: true,
        ticket,
        unprocessed: productsWithoutStock.map(p => p.product._id)
    };
};