import ServerError from '../helpers/serverError.helpers.js';

// Validadores reutilizables - contienen únicamente lógica de validación de formato
export const validators = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ServerError('El email ingresado no es válido', 400);
        }
    },

    password: (password) => {
        const minLength = password.length >= 6;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (!minLength || !hasLower || !hasUpper || !hasNumber) {
            throw new ServerError(
                'La contraseña debe tener mínimo 6 caracteres, incluir mayúscula, minúscula y número',
                400
            );
        }
    },

    firstName: (firstName) => {
        const isValid = /^[a-zA-Z]{3,}$/.test(firstName);
        if (!isValid) {
            throw new ServerError(
                'El nombre debe contener solo letras y tener mínimo 3 caracteres',
                400
            );
        }
    },

    lastName: (lastName) => {
        const isValid = /^[a-zA-Z]{3,}$/.test(lastName);
        if (!isValid) {
            throw new ServerError(
                'El apellido debe contener solo letras y tener mínimo 3 caracteres',
                400
            );
        }
    },

    userName: (userName) => {
        const isValid = userName && userName.length >= 3;
        if (!isValid) {
            throw new ServerError(
                'El nombre de usuario debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    workspaceName: (name) => {
        const isValid = name && name.length >= 3;
        if (!isValid) {
            throw new ServerError(
                'El nombre del workspace debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    channelName: (name) => {
        const isValid = name && name.length >= 3;
        if (!isValid) {
            throw new ServerError(
                'El nombre del canal debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    code2FA: (code) => {
        const isValid = /^[0-9]{6}$/.test(String(code));
        if (!isValid) {
            throw new ServerError('El código 2FA debe ser de 6 dígitos', 400);
        }
    },

    token: (token) => {
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
            throw new ServerError('El token es requerido y debe ser válido', 400);
        }
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        if (!jwtRegex.test(token)) {
            throw new ServerError('El formato del token no es válido', 400);
        }
    }
};

export default validators;
