import authService from '../services/auth.service.js';

const authController = {
    async checkEmail(req, res, next) {
        try {
            const { email } = req.query;
            const result = await authService.checkEmail(email);

            return res.status(200).json({
                ok: true,
                message: 'Email registrado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async register(req, res, next) {
        try {
            const result = await authService.registerUser(req.body);

            return res.status(201).json({
                ok: true,
                message: 'Usuario registrado exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async verifyEmail(req, res, next) {
        try {
            const { token } = req.body;
            const result = await authService.verifyEmail(token);

            return res.status(200).json({
                ok: true,
                message: 'Email verificado exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            return res.status(200).json({
                ok: true,
                message: 'Login requerido 2FA',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async verify2FA(req, res, next) {
        try {
            const { email, code } = req.body;
            const result = await authService.verify2FA(email, code);

            return res.status(200).json({
                ok: true,
                message: 'Login exitoso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await authService.forgotPassword(email);

            return res.status(200).json({
                ok: true,
                message: 'Email de recuperación enviado',
                data: null
            });
        } catch (error) {
            next(error);
        }
    },

    async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            const result = await authService.resetPassword(token, password);

            return res.status(200).json({
                ok: true,
                message: 'Contraseña reseteada exitosamente',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default authController;
