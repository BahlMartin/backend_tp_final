import ServerError from '../utils/helpers/serverError.helpers.js';

// Factory para crear middlewares de validación de body
// Valida presencia de campos requeridos y ejecuta validadores de formato
function validateBodyMiddleware(schema) {
    return (req, res, next) => {
        try {
            if (Object.keys(schema).length === 0) {
                throw new ServerError(
                'El body de la solicitud no contiene campos para validar',
                400
            );
            }
            

            for (const [field, validator] of Object.entries(schema)) {
                const value = req.body[field];

                if (validator.required && (value === undefined || value === null || value === '')) {
                    throw new ServerError(`El campo '${field}' es requerido`, 400);
                }

                if (value !== undefined && value !== null && value !== '' && validator.validate) {
                    validator.validate(value);
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
export default validateBodyMiddleware;
