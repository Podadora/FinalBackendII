import CartModel from "../models/cart.js";

class CartDAO {
    async getById(id) {
        return await CartModel.findById(id).populate("products.product").lean();
    }

    async create() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    }

    async update(id, updateData) {
        return await CartModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async addProduct(cartId, productId, quantity = 1) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async clear(cartId) {
        return await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
    }

    async removeProduct(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }
}

export default new CartDAO();