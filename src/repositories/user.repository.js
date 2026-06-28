import User from "../models/user.model.js";

class UserRepository {

    async getById(user_id) {
        return await User.findById(user_id);
    }

    async create(first_name, last_name, user_name, email, password) {
        return await User.create({
            first_name,
            last_name,
            user_name,
            email,
            password
        });
    }
    async getByEmail(email) {
        const user_found = await User.findOne({ email: email });
        return user_found;
    }
    async softDeleteById(user_id) {
        await User.findByIdAndUpdate(user_id, { active: false });
    }
    async updateById(user_id, update_data) {
        return await User.findByIdAndUpdate(user_id, update_data);
    }

}


export const userRepository = new UserRepository();
export default userRepository;