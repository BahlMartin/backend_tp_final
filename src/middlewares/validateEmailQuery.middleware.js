import ServerError from '../utils/helpers/serverError.helpers.js';
import { validators } from '../utils/validators/validators.js';

function validateEmailQueryMiddleware(req, res, next) {
    try {
        const { email } = req.query;

        if (!email) {
            throw new ServerError('Email es requerido en query params', 400);
        }

        validators.email(email);

        next();
    } catch (error) {
        next(error);
    }
}

export default validateEmailQueryMiddleware;
