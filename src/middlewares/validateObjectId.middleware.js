import mongoose from 'mongoose';
import ServerError from '../utils/helpers/serverError.helpers.js';

function validateObjectIdMiddleware(paramName) {
    return (req, res, next) => {
        try {
            const id = req.params[paramName];

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                throw new ServerError(`ID inválido: ${paramName}`, 400);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default validateObjectIdMiddleware;
