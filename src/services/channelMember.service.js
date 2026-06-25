import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

class ChannelMemberService {
    async addMember(userId, channelId, memberData) {
        const { user_id } = memberData;

        // Verificar que el usuario a agregar existe
        const userToAdd = await userRepository.getById(user_id);
        if (!userToAdd) {
            throw new ServerError('Usuario no encontrado', 404);
        }

        // El canal y permisos ya fueron validados por el middleware
        // Solo agregamos el miembro

        const channelMember = await channelMemberRepository.create(channelId, user_id);

        return {
            _id: channelMember._id,
            fk_user_id: user_id
        };
    }

    async removeMember(userId, channelId, memberId) {
        // El usuario ya fue validado por el middleware
        // Solo eliminamos el miembro del canal
        await channelMemberRepository.hardDeleteById(memberId);
    }
}

export default new ChannelMemberService();
