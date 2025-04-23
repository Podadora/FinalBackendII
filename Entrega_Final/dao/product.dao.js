import ProductModel from "../models/product.js";

class ProductDAO {
    async getAll(filter = {}, options = {}) {
        return await ProductModel.paginate(filter, options);
    }

    async getById(id) {
        return await ProductModel.findById(id).lean();
    }

    async create(data) {
        const newProduct = new ProductModel(data);
        return await newProduct.save();
    }

    async update(id, updateData) {
        return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();