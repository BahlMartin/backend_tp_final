import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENVIRONMENT from '../config/enviroment.config.js';
import ServerError from '../utils/helpers/serverError.helpers.js';
import userRepository from '../repositories/user.repository.js';
import verificationTokenRepository from '../repositories/verificationToken.repository.js';
import mailService from './mail.service.js';
import TOKEN_TYPES from '../utils/constants/tokenTypes.constants.js';

/**
 * AuthService
 * 
 * Responsabilidades:
 * - Lógica de negocio de autenticación
 * - Consultas a repositorios
 * - Generación de JWT
 * - Hashing de contraseñas
 * - Envío de correos
 * 
 * NO hace:
 * - Validación de formato (responsabilidad de middlewares)
 * - Validación de campos requeridos (responsabilidad de middlewares)
 * 
 * Los datos llegan validados desde los middlewares
 */
class AuthService {
    /**
     * Verifica si un email existe
     * 
     */
    async checkEmail(email) {
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('El email no se encuentra registrado', 404);
        }
        return {
            exists: true,
            email
        };
    }

    /**
     * Registra un nuevo usuario
     * 
     */
    async registerUser(user_data) {
        const { email, password, first_name, last_name, user_name } = user_data;
        const existing_user = await userRepository.getByEmail(email);
        if (existing_user) {
            if (existing_user.verification_email) {
                throw new ServerError('El email ya se encuentra registrado', 409);
            }

            // Si existe y no está verificado, revisar si tiene token vigente
            const existing_token = await verificationTokenRepository.getValidByUserIdAndType(
                existing_user._id,
                TOKEN_TYPES.VERIFICATION_EMAIL
            );

            if (existing_token) {
                throw new ServerError('Ya existe un token de verificación vigente', 409);
            }

            // Si no tiene token vigente, generar uno nuevo y reenviar email
            const verification_token = jwt.sign(
                { user_id: existing_user._id },
                ENVIRONMENT.JWT_SECRET,
                { expiresIn: '15m' }
            );

            await verificationTokenRepository.create(
                existing_user._id,
                verification_token,
                TOKEN_TYPES.VERIFICATION_EMAIL,
                new Date(Date.now() + 15 * 60 * 1000)
            );

            try {
                await mailService.sendVerificationEmail(existing_user.email, verification_token);
            } catch (error) {
                console.error('Error reenviando email de verificación:', error);
            }

            return {
                user_id: existing_user._id,
                email: existing_user.email,
                message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.'
            };
        }

        // Hash de contraseña
        const hashed_password = await bcrypt.hash(password, 12);

        // Crear usuario
        const user = await userRepository.create(
            first_name,
            last_name,
            user_name,
            email,
            hashed_password
        );

        // Generar token de verificación (15 minutos)
        const verification_token = jwt.sign(
            { user_id: user._id },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '15m' }
        );

        await verificationTokenRepository.create(
            user._id,
            verification_token,
            TOKEN_TYPES.VERIFICATION_EMAIL,
            new Date(Date.now() + 15 * 60 * 1000)
        );


        try {
            await mailService.sendVerificationEmail(user.email, verification_token);
        } catch (error) {
            console.error('Error enviando email de verificación:', error);
            // No lanzamos error, el usuario se registró pero no recibió el correo
        }

        return {
            user_id: user._id,
            email: user.email,
            message: 'Usuario registrado. Revisa tu email para verificar tu cuenta.'
        };
    }

    /**
     * Verifica el email del usuario usando token JWT
     * 
     */
    async verifyEmail(token) {
        // Verificar y decodificar token JWT
        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
        const user_id = decoded.user_id;

        // Marcar usuario como verificado
        await userRepository.updateById(user_id, { verification_email: true });

        return {
            user_id,
            verified: true,
            message: 'Email verificado exitosamente'
        };
    }

    /**
     * Realiza login y genera código 2FA
     * 
     */
    async login(email, password) {
        // Obtener usuario
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Email o contraseña incorrectos', 401);
        }

        // Validación de negocio: contraseña correcta
        const valid_password = await bcrypt.compare(password, user.password);
        if (!valid_password) {
            throw new ServerError('contraseña incorrecta', 401);
        }

        // Validación de negocio: email verificado
        if (!user.verification_email) {
            throw new ServerError('Email no verificado. Revisa tu correo.', 403);
        }

        // Validar si ya hay un código 2FA vigente
        const existing_2fa = await verificationTokenRepository.getValidByUserIdAndType(
            user._id,
            TOKEN_TYPES.CODE2FA
        );
        if (existing_2fa) {
            throw new ServerError('Ya existe un código 2FA vigente', 409);
        }

        // Generar código 2FA (6 dígitos)
        const code_2fa = String(Math.floor(100000 + Math.random() * 900000));

        // Guardar código 2FA (15 minutos de validez)
        const verification_token = jwt.sign(
            { user_id: user._id, code: code_2fa },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '15m' }
        );

        await verificationTokenRepository.create(
            user._id,
            verification_token,
            TOKEN_TYPES.CODE2FA,
            new Date(Date.now() + 15 * 60 * 1000)
        );


        try {
            await mailService.send2FAEmail(user.email, code_2fa);
        } catch (error) {
            console.error('Error enviando código 2FA:', error);
        }

        return {
            user_id: user._id,
            email: user.email,
            message: 'Código 2FA enviado a tu email'
        };
    }

    /**
     * Verifica código 2FA y genera JWT de acceso
     * Valida que el código sea correcto consultando el repositorio de tokens
     */
    async verify2FA(email, code) {
        // Obtener usuario por email
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        // Buscar el token 2FA válido (no expirado) para este usuario
        const token_record = await verificationTokenRepository.getValidByUserIdAndType(
            user._id,
            TOKEN_TYPES.CODE2FA
        );

        if (!token_record) {
            throw new ServerError('Código 2FA no encontrado o expirado', 401);
        }

        // Decodificar el token JWT para obtener el código almacenado
        let decoded_token;
        try {
            decoded_token = jwt.verify(token_record.token, ENVIRONMENT.JWT_SECRET);
        } catch (error) {
            throw new ServerError('Token 2FA inválido o expirado', 401);
        }
        const code_token = String(decoded_token.code);

        // Verificar que el código coincida
        if (code_token !== String(code)) {
            throw new ServerError('Código 2FA incorrecto', 401);
        }

        // Eliminar el token usado (por seguridad, para evitar reutilización)
        await verificationTokenRepository.hardDeleteById(token_record._id);

        // Generar JWT de acceso (24 horas)
        const access_token = jwt.sign(
            { user_id: user._id, email: user.email },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            user_id: user._id,
            email: user.email,
            access_token,
            message: 'Login exitoso'
        };
    }

    /**
     * Genera token para recuperación de contraseña
     * 
     */
    async forgotPassword(email) {
        // Obtener usuario
        const user = await userRepository.getByEmail(email);

        // Por seguridad, no revelar si el usuario existe
        if (!user) {
            return {
                message: 'Si el email existe en nuestro sistema, recibirás instrucciones'
            };
        }

        // Validar si ya hay un token de recuperación vigente
        const existing_token = await verificationTokenRepository.getValidByUserIdAndType(
            user._id,
            TOKEN_TYPES.RESET_PASSWORD
        );
        if (existing_token) {
            throw new ServerError('Ya existe un token de recuperación vigente', 409);
        }

        // Generar token de recuperación (5 minutos)
        const reset_token = jwt.sign(
            { user_id: user._id },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '5m' }
        );

        await verificationTokenRepository.create(
            user._id,
            reset_token,
            TOKEN_TYPES.RESET_PASSWORD,
            new Date(Date.now() + 5 * 60 * 1000)
        );

        try {
            await mailService.sendPasswordResetEmail(user.email, reset_token);
        } catch (error) {
            console.error('Error enviando email de recuperación:', error);
        }

        return {
            message: 'Si el email existe en nuestro sistema, recibirás instrucciones'
        };
    }

    /**
     * Actualiza la contraseña usando token de recuperación
     * 
     */
    async resetPassword(token, new_password) {
        // Verificar y decodificar token JWT
        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);
        const user_id = decoded.user_id;

        // Hash de la nueva contraseña
        const hashed_password = await bcrypt.hash(new_password, 12);

        // Actualizar contraseña en base de datos
        await userRepository.updateById(user_id, { password: hashed_password });

        return {
            user_id,
            message: 'Contraseña actualizada exitosamente'
        };
    }
}

export default new AuthService();
