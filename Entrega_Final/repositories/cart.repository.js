import CartDAO from "../dao/cart.dao.js";

class CartRepository {
    async getCartById(id) {
        return await CartDAO.getById(id);
    }

    async createCart() {
        return await CartDAO.create();
    }

    async updateCart(id, update) {
        return await CartDAO.update(id, update);
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        return await CartDAO.addProduct(cartId, productId, quantity);
    }

    async clearCart(cartId) {
        return await CartDAO.clear(cartId);
    }

    async removeProduct(cartId, productId) {
        return await CartDAO.removeProduct(cartId, productId);
    }
}

export default new CartRepository();