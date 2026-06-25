import VerificationToken from '../models/verificationToken.model.js';

class VerificationTokenRepository {
    /**
     * Crea un nuevo token de verificación
     * @param {ObjectId} user_id - ID del usuario
     * @param {String} token - Token JWT
     * @param {String} type_token - Tipo de token (del enum TOKEN_TYPES)
     * @param {Date} expiration_date - Fecha de expiración
     */
    async create(user_id, token, type_token, expiration_date) {
        return await VerificationToken.create({
            fk_user_id: user_id,
            token,
            type_token,
            expiration_date
        });
    }

    /**
     * Obtiene todos los tokens de un usuario
     */
    async getByUserId(user_id) {
        return await VerificationToken.find({ fk_user_id: user_id });
    }

    /**
     * Obtiene un token válido por usuario ID
     */
    async getValidByUserId(user_id) {
        return await VerificationToken.findOne({
            fk_user_id: user_id,
            expiration_date: { $gt: new Date() }
        });
    }

    /**
     * Obtiene un token por su ID
     */
    async getByTokenId(token_id) {
        return await VerificationToken.findOne({ _id: token_id });
    }

    /**
     * Obtiene el token más reciente de un usuario para un tipo específico
     * @param {ObjectId} user_id - ID del usuario
     * @param {String} type_token - Tipo de token a buscar
     */
    async getByUserIdAndType(user_id, type_token) {
        return await VerificationToken.findOne({
            fk_user_id: user_id,
            type_token
        }).sort({ created_at: -1 });
    }

    /**
     * Obtiene un token válido (no expirado) de un usuario para un tipo específico
     */
    async getValidByUserIdAndType(user_id, type_token) {
        return await VerificationToken.findOne({
            fk_user_id: user_id,
            type_token,
            expiration_date: { $gt: new Date() }
        }).sort({ created_at: -1 });
    }

    /**
     * Elimina un token por su ID
     */
    async hardDeleteById(token_id) {
        return await VerificationToken.findByIdAndDelete(token_id);
    }

    /**
     * Elimina todos los tokens de un usuario de un tipo específico
     */
    async deleteByUserIdAndType(user_id, type_token) {
        return await VerificationToken.deleteMany({
            fk_user_id: user_id,
            type_token
        });
    }

}

export const verificationTokenRepository = new VerificationTokenRepository();

export default verificationTokenRepository; 