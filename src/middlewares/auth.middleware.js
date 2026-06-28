import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/enviroment.config.js';
import ServerError from '../utils/helpers/serverError.helpers.js';

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ServerError('Token no proporcionado', 401);
        }

        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
        req.user = {
            user_id: decoded.user_id,
            email: decoded.email
        };

        next();
    } catch (error) {
        next(error);
    }
}

export default authMiddleware;
