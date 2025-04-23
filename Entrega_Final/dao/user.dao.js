import UserModel from "../models/user.js";

class UserDAO {
    async getById(id) {
        return await UserModel.findById(id).lean();
    }

    async getByEmail(email) {
        return await UserModel.findOne({ email }).lean();
    }

    async create(data) {
        const newUser = new UserModel(data);
        return await newUser.save();
    }
}

export default new UserDAO();