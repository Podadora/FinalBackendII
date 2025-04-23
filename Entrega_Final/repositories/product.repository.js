import ProductDAO from "../dao/product.dao.js";

class ProductRepository {
    async getAllProducts(filter = {}, options = {}) {
        return await ProductDAO.getAll(filter, options);
    }

    async getProductById(id) {
        return await ProductDAO.getById(id);
    }

    async createProduct(data) {
        return await ProductDAO.create(data);
    }

    async updateProduct(id, update) {
        return await ProductDAO.update(id, update);
    }

    async deleteProduct(id) {
        return await ProductDAO.delete(id);
    }
}

export default new ProductRepository();