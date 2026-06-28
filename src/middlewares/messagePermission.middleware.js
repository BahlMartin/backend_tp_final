import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

async function messagePermissionMiddleware(req, res, next) {
    try {
        const user_id = req.user.user_id;
        const message = req.message; // Proviene de attachMessageMiddleware

        const channel_id = message.fk_workspace_channel_id;

        // Obtener el canal para sacar el workspace_id
        const channel = await workspaceChannelRepository.getByChannelId(channel_id);
        if (!channel) {
            throw new ServerError('Canal no encontrado', 404);
        }

        const workspace_id = channel.fk_workspace_id;

        // Obtener la membresía del usuario en el workspace
        const workspace_membership = await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);

        if (!workspace_membership || !workspace_membership.active) {
            throw new ServerError('No tienes permiso para acceder a este workspace', 403);
        }

        // Verificar si el usuario está en el canal
        const members = await channelMemberRepository.getMembersByChannelId(channel_id);
        const channel_member = members.find(member => member.workspace_member_id && member.workspace_member_id.toString() === workspace_membership._id.toString());

        const is_channel_member = channel_member ? true : false;

        if (!is_channel_member) {
            throw new ServerError('No eres miembro de este canal', 403);
        }

        // Si el usuario es el creador del mensaje
        // message.fk_channel_member_id es un ObjectId, que puede o no estar poblado (populated).
        let author_channel_member_id = null;
        if (message.fk_channel_member_id) {
            if (message.fk_channel_member_id._id) {
                author_channel_member_id = message.fk_channel_member_id._id.toString();
            } else {
                author_channel_member_id = message.fk_channel_member_id.toString();
            }
        }

        const is_author = author_channel_member_id === channel_member.channel_member_id.toString();

        if (is_author) {
            return next();
        }

        throw new ServerError('No tienes permiso para modificar o eliminar este mensaje. Solo el autor puede hacerlo.', 403);
    } catch (error) {
        next(error);
    }
}

export default messagePermissionMiddleware;
