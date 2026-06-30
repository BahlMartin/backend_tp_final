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
    async createChannel(user_id, workspace_id, channel_data, preloaded_membership = null) {
        const { name, description } = channel_data;
        // Crear canal
        const channel = await workspaceChannelRepository.create(
            workspace_id,
            name,
            description || null
        );

        // Agregar al creador como miembro del canal
        const creator_membership = preloaded_membership || await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);
        if (creator_membership) {
            await channelMemberRepository.create(channel._id, creator_membership._id);
        }

        // Agregar al dueño del workspace como miembro del canal
        const owner_member = await workspaceMemberRepository.getWorkspaceOwner(workspace_id);

        if (owner_member && (!creator_membership || owner_member._id.toString() !== creator_membership._id.toString())) {
            await channelMemberRepository.create(channel._id, owner_member._id);
        }

        return {
            _id: channel._id
        };
    }

    /**
     * Obtiene todos los canales de un workspace a los que el usuario tiene acceso
     */
    async getChannelsByWorkspace(workspace_id, user_id, preloaded_membership = null) {
        const channels = await workspaceChannelRepository.getByWorkspaceId(workspace_id);
        const workspace_membership = preloaded_membership || await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);
        
        if (!workspace_membership || !workspace_membership.active) {
            return [];
        }

        const channelMemberships = await channelMemberRepository.getChannelsByWorkspaceMemberId(workspace_membership._id);
        const memberChannelIds = channelMemberships.map(mc => mc.fk_workspace_channel_id.toString());

        const filteredChannels = channels.filter(channel => 
            channel.name === 'general' || memberChannelIds.includes(channel._id.toString())
        );

        return filteredChannels.map(channel => ({
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
    async deleteChannel(user_id, workspace_id, channel_id, preloaded_channel = null) {
        // Obtener el canal directamente por su ID para optimizar la consulta
        const channel = preloaded_channel || await workspaceChannelRepository.getByChannelId(channel_id);

        if (!channel || channel.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('Canal no encontrado', 404);
        }

        // Eliminar canal (hard delete)
        await workspaceChannelRepository.hardDeleteById(workspace_id, channel_id);
    }

    async updateChannel(user_id, workspace_id, channel_id, channel_data, preloaded_channel = null) {
        // Obtener el canal directamente por su ID para optimizar la consulta
        const channel = preloaded_channel || await workspaceChannelRepository.getByChannelId(channel_id);

        if (!channel || channel.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('Canal no encontrado', 404);
        }

        const { name, description } = channel_data;
        const updated_channel = await workspaceChannelRepository.updateById(workspace_id, channel_id, {
            name: name || channel.name,
            description: description !== undefined ? description : channel.description
        });

        return {
            _id: updated_channel._id,
            name: updated_channel.name,
            description: updated_channel.description
        };
    }
}

export default new ChannelService();
