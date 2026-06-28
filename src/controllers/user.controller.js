import userService from '../services/user.service.js';

const userController = {
    async getMe(req, res, next) {
        try {
            const user_id = req.user.user_id;
            const result = await userService.getUserById(user_id);

            return res.status(200).json({
                ok: true,
                message: 'Usuario obtenido',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateMe(req, res, next) {
        try {
            const user_id = req.user.user_id;
            const result = await userService.updateUser(user_id, req.body);

            return res.status(200).json({
                ok: true,
                message: 'Usuario actualizado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default userController;
