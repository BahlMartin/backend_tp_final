import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

/**
 * WorkspaceService
 * 
 * Responsabilidades:
 * - Crear y gestionar workspaces
 * - Crear canal general automáticamente
 * - Validaciones de negocio (workspace no duplicado)
 */
class WorkspaceService {
    /**
     * Crea un nuevo workspace
     * Asume que el nombre ya fue validado por middleware
     * Automáticamente crea canal general y agrega usuario como owner
     */
    async createWorkspace(user_id, workspace_data) {
        const { name, description } = workspace_data;
        // Crear workspace
        const workspace = await workspaceRepository.create(name, description || null);

        // Agregar usuario como owner del workspace
        const owner_member = await workspaceMemberRepository.create(
            user_id,
            workspace._id,
            MEMBER_WORKSPACE_ROLES.OWNER
        );

        // Crear canal general automáticamente
        const general_channel = await workspaceChannelRepository.create(
            workspace._id,
            'general',
            'Canal general del workspace'
        );

        // Agregar automáticamente al Owner al canal general creado
        await channelMemberRepository.create(
            general_channel._id,
            owner_member._id
        );

        return {
            _id: workspace._id,
        };
    }

    /**
     * Obtiene todos los workspaces donde el usuario es miembro
     */
    async getWorkspacesByUser(user_id) {
        const memberships = await workspaceMemberRepository.getByUserId(user_id);
        if (!memberships) {
            throw new ServerError('No se encontraron workspaces para el usuario', 404);
        }

        const active_workspaces = memberships.filter(membership => membership.workspace_estado);
        return active_workspaces.length > 0 ? active_workspaces : null;
    }

    /**
     * Obtiene información de un workspace específico
     */
    async getWorkspaceById(workspace_id, precargado = null) {
        const workspace = precargado || await workspaceRepository.getById(workspace_id);

        if (!workspace) {
            throw new ServerError('Workspace no encontrado', 404);
        }

        return {
            _id: workspace._id,
            name: workspace.name,
            description: workspace.description
        };
    }

    /**
     * Actualiza información del workspace
     * Asume que los datos ya fueron validados por middleware si se envían
     */
    async updateWorkspace(workspace_id, update_data) {
        const { name, description } = update_data;

        const data_to_update = {};
        if (name) {
            data_to_update.name = name;
        }
        if (description !== undefined) {
            data_to_update.description = description;
        }

        const updated_workspace = await workspaceRepository.updateById(
            workspace_id,
            data_to_update
        );

        return {
            _id: updated_workspace._id,
            name: updated_workspace.name,
            description: updated_workspace.description
        };
    }

    /**
     * Elimina un workspace (soft delete)
     */
    async deleteWorkspace(workspace_id, preloaded_workspace = null) {
        const workspace = preloaded_workspace || await workspaceRepository.getById(workspace_id);

        if (!workspace) {
            throw new ServerError('Workspace no encontrado', 404);
        }

        // Marcar como inactivo (soft delete)
        await workspaceRepository.softDeleteById(workspace_id);
    }
}

export default new WorkspaceService();


