import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

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
    async getChannelById(channelId) {
        // El middleware channelMembershipMiddleware ya adjunta el canal
        return {
            message: 'Canal obtenido del middleware'
        };
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
}

export default new ChannelService();
