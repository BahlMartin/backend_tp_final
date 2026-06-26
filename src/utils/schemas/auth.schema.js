import { validators } from '../validators/validators.js';

// Schema para verificar existencia de email
export const checkEmailSchema = {
    email: {
        required: true,
        validate: validators.email
    }
};

// Schema para registro
export const registerSchema = {
    email: {
        required: true,
        validate: validators.email
    },
    password: {
        required: true,
        validate: validators.password
    },
    first_name: {
        required: true,
        validate: validators.firstName
    },
    last_name: {
        required: true,
        validate: validators.lastName
    },
    user_name: {
        required: true,
        validate: validators.userName
    }
};

// Schema para login
export const loginSchema = {
    email: {
        required: true,
        validate: validators.email
    },
    password: {
        required: true,
        validate: (value) => {
            // En login no validamos formato, solo presencia (la validación de corrección se hace en service)
            if (!value || value.length === 0) {
                throw new Error('La contraseña es requerida');
            }
        }
    }
};

// Schema para verificación de email con token
export const verifyEmailSchema = {
    token: {
        required: true,
        validate: validators.token
    }
};

// Schema para verificación de 2FA
export const verify2FASchema = {
    email: {
        required: true,
        validate: validators.email
    },
    code: {
        required: true,
        validate: validators.code2FA
    }
};

// Schema para solicitud de recuperación de contraseña
export const forgotPasswordSchema = {
    email: {
        required: true,
        validate: validators.email
    }
};

// Schema para reset de contraseña (query params)
export const resetPasswordQuerySchema = {
    token: {
        required: true,
        validate: validators.token
    }
};

// Schema para reset de contraseña (body)
export const resetPasswordBodySchema = {
    password: {
        required: true,
        validate: validators.password
    }
};

export default {
    checkEmailSchema,
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    verify2FASchema,
    forgotPasswordSchema,
    resetPasswordQuerySchema,
    resetPasswordBodySchema
};
