import ServerError from '../utils/helpers/serverError.helpers.js';
import userRepository from '../repositories/user.repository.js';

/**
 * UserService
 * 
 * Responsabilidades:
 * - Obtener información del usuario
 * - Actualizar datos del usuario
 * - Validaciones de negocio (email no duplicado)
 */
class UserService {
    /**
     * Obtiene la información del usuario
     */
    async getUserById(user_id) {
        const user = await userRepository.getById(user_id);

        if (!user) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        return {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name
        };
    }

    /**
     * Actualiza información del usuario
     */
    async updateUser(user_id, update_data) {
        const { email, first_name, last_name, user_name } = update_data;

        // Validacion de negocio: verificar que el email no este duplicado
        if (email) {
            const existingUser = await userRepository.getByEmail(email);
            if (existingUser && existingUser._id.toString() !== user_id) {
                throw new ServerError('El email ya se encuentra registrado', 409);
            }
        }

        // Preparar objeto de actualización solo con campos permitidos
        const data_to_update = {};
        if (email) { data_to_update.email = email; }
        if (first_name) { data_to_update.first_name = first_name; }
        if (last_name) { data_to_update.last_name = last_name; }
        if (user_name) { data_to_update.user_name = user_name; }

        const updatedUser = await userRepository.updateById(user_id, data_to_update);

        return {
            user_id: updatedUser._id
        };
    }
}

export default new UserService();


