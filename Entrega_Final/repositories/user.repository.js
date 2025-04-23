import UserDAO from "../dao/user.dao.js";

class UserRepository {
    async getUserById(id) {
        return await UserDAO.getById(id);
    }

    async getUserByEmail(email) {
        return await UserDAO.getByEmail(email);
    }

    async createUser(userData) {
        return await UserDAO.create(userData);
    }
}

export default new UserRepository();