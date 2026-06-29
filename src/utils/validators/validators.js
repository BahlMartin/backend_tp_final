import ServerError from '../helpers/serverError.helpers.js';
import mongoose from 'mongoose';
// Validadores reutilizables - contienen únicamente lógica de validación de formato
export const validators = {
    email: (email) => {
        const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email_regex.test(email)) {
            throw new ServerError('El email ingresado no es válido', 400);
        }
    },

    password: (password) => {
        const min_length = password.length >= 6;
        const has_lower = /[a-z]/.test(password);
        const has_upper = /[A-Z]/.test(password);
        const has_number = /[0-9]/.test(password);

        if (!min_length || !has_lower || !has_upper || !has_number) {
            throw new ServerError(
                'La contraseña no cumple los requisitos mínimos',
                400
            );
        }
    },

    firstName: (first_name) => {
        const is_valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,}$/.test(first_name);
        if (!is_valid) {
            throw new ServerError(
                'El nombre debe contener solo letras y tener mínimo 3 caracteres',
                400
            );
        }
    },

    lastName: (last_name) => {
        const is_valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,}$/.test(last_name);
        if (!is_valid) {
            throw new ServerError(
                'El apellido debe contener solo letras y tener mínimo 3 caracteres',
                400
            );
        }
    },

    userName: (user_name) => {
        const is_valid = user_name && user_name.length >= 3;
        if (!is_valid) {
            throw new ServerError(
                'El nombre de usuario debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    workspaceName: (name) => {
        const is_valid = name && name.length >= 3;
        if (!is_valid) {
            throw new ServerError(
                'El nombre del workspace debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    channelName: (name) => {
        const is_valid = name && name.length >= 3;
        if (!is_valid) {
            throw new ServerError(
                'El nombre del canal debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    workspaceDescription: (description) => {
        const is_valid = description && description.length >= 3;
        if (!is_valid) {
            throw new ServerError(
                'La descripción del workspace debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    channelDescription: (description) => {
        const is_valid = description && description.length >= 3;
        if (!is_valid) {
            throw new ServerError(
                'La descripción del canal debe tener mínimo 3 caracteres',
                400
            );
        }
    },

    code2FA: (code) => {
        const is_valid = /^[0-9]{6}$/.test(String(code));
        if (!is_valid) {
            throw new ServerError('El código 2FA debe ser de 6 dígitos', 400);
        }
    },

    token: (token) => {
        if (!token || typeof token !== 'string' || token.trim().length === 0) {
            throw new ServerError('El token es requerido y debe ser válido', 400);
        }
        const jwt_regex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        if (!jwt_regex.test(token)) {
            throw new ServerError('El formato del token no es válido', 400);
        }
    },

    messageContent: (content) => {
        const is_valid = content && content.trim().length > 0;
        if (!is_valid) {
            throw new ServerError(
                'El contenido del mensaje no puede estar vacío',
                400
            );
        }
    },

    objectId: (id) => {
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new ServerError(`ID inválido: ${id}`, 400);
        }
    }
};

export default validators;
