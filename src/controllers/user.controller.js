import userService from '../services/user.service.js';

const userController = {
    async getMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const result = await userService.getUserById(userId);

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
            const userId = req.user.userId;
            const result = await userService.updateUser(userId, req.body);

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
