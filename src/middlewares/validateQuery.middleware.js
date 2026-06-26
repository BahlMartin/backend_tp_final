import ServerError from '../utils/helpers/serverError.helpers.js';

// Factory para crear middlewares de validación de query params
function validateQueryMiddleware(schema) {
    return (req, res, next) => {
        try {
            if (Object.keys(schema).length === 0) {
                throw new ServerError(
                    'La consulta no contiene campos para validar',
                    400
                );
            }

            for (const [field, validator] of Object.entries(schema)) {
                const value = req.query[field];

                if (validator.required && (value === undefined || value === null || value === '')) {
                    throw new ServerError(`El parámetro '${field}' en la query es requerido`, 400);
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

export default validateQueryMiddleware;
