import ServerError from '../utils/helpers/serverError.helpers.js';
import userRepository from '../repositories/user.repository.js';

/**
 * UserService
 * 
 * Responsabilidades:
 * - Obtener información del usuario
 * - Actualizar datos del usuario
 * - Validaciones de negocio (email no duplicado)
 * 
 * NO hace:
 * - Validación de formato (responsabilidad de middlewares)
 */
class UserService {
    /**
     * Obtiene la información del usuario
     */
    async getUserById(userId) {
        const user = await userRepository.getById(userId);

        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        return {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            verification_email: user.verification_email,
            creation_date: user.creation_date
        };
    }

    /**
     * Actualiza información del usuario
     * Asume que los datos ya fueron validados por middleware si se envían
     */
    async updateUser(userId, updateData) {
        const { email, first_name, last_name, user_name } = updateData;

        // Validación de negocio: verificar si el email ya existe en otro usuario
        if (email) {
            const existingUser = await userRepository.getByEmail(email);
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new ServerError('El email ya se encuentra registrado', 409);
            }
        }

        // Preparar objeto de actualización solo con campos permitidos
        const dataToUpdate = {};
        if (email) dataToUpdate.email = email;
        if (first_name) dataToUpdate.first_name = first_name;
        if (last_name) dataToUpdate.last_name = last_name;
        if (user_name) dataToUpdate.user_name = user_name;

        const updatedUser = await userRepository.updateById(userId, dataToUpdate);

        return {
            _id: updatedUser._id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            user_name: updatedUser.user_name,
            verification_email: updatedUser.verification_email,
            creation_date: updatedUser.creation_date
        };
    }
}

export default new UserService();


