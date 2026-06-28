import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import ChannelMemberService from "./channelMember.service.js"
/**
 * ChannelService
 * 
 * Responsabilidades:
 * - Crear y gestionar canales dentro de workspaces
 * - Validaciones de negocio (usuario es miembro del workspace)
 * 
 * NO hace:
 * - Validación de formato (responsabilidad de middlewares)
 */
class ChannelService {
    /**
     * Crea un nuevo canal dentro de un workspace
     * Asume que el nombre ya fue validado por middleware
     */
    async createChannel(userId, workspaceId, channelData) {
        const { name, description } = channelData;
        // Crear canal
        const channel = await workspaceChannelRepository.create(
            workspaceId,
            name,
            description || null
        );

        // Agregar al creador como miembro del canal
        const creatorMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(userId, workspaceId);
        if (creatorMembership) {
            await channelMemberRepository.create(channel._id, creatorMembership._id);
        }

        // Agregar al dueño del workspace como miembro del canal
        const allMembers = await workspaceMemberRepository.getMembersByWorkspaceId(workspaceId);
        const ownerMember = allMembers.find(member => member.member_rol === MEMBER_WORKSPACE_ROLES.OWNER);

        if (ownerMember && (!creatorMembership || ownerMember.member_id.toString() !== creatorMembership._id.toString())) {
            await channelMemberRepository.create(channel._id, ownerMember.member_id);
        }

        return {
            _id: channel._id
        };
    }

    /**
     * Obtiene todos los canales de un workspace
     */
    async getChannelsByWorkspace(workspaceId) {
        const channels = await workspaceChannelRepository.getByWorkspaceId(workspaceId);

        return channels.map(channel => ({
            _id: channel._id,
            name: channel.name,
            description: channel.description
        }));
    }

    /**
     * Obtiene información de un canal específico
     */
    async getChannelById(channel_id) {
        const channel = await workspaceChannelRepository.getByChannelId(channel_id);
        if (!channel) {
            throw new ServerError('Canal no encontrado', 404);
        }
        return channel;
    }

    /**
     * Elimina un canal
     */
    async deleteChannel(user_id, workspace_id, channel_id) {
        // Obtener el canal
        const channels = await workspaceChannelRepository.getByWorkspaceId(workspace_id);
        const channel = channels.find(channel => channel._id.toString() === channel_id);

        if (!channel) {
            throw new ServerError('Canal no encontrado', 404);
        }

        if (channel.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('El canal no pertenece al workspace', 403);
        }

        // Eliminar canal (hard delete)
        await workspaceChannelRepository.hardDeleteById(workspace_id, channel_id);
    }
    async updateChannel(user_id, workspace_id, channel_id, channelData) {
        // Obtener el canal
        const channels = await workspaceChannelRepository.getByWorkspaceId(workspace_id);
        const channel = channels.find(channel => channel._id.toString() === channel_id);

        if (!channel) {
            throw new ServerError('Canal no encontrado', 404);
        }

        if (channel.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('El canal no pertenece al workspace', 403);
        }

        const { name, description } = channelData;
        const updatedChannel = await workspaceChannelRepository.updateById(workspace_id, channel_id, {
            name: name || channel.name,
            description: description !== undefined ? description : channel.description
        });

        return {
            _id: updatedChannel._id,
            name: updatedChannel.name,
            description: updatedChannel.description
        };
    }
}

export default new ChannelService();
