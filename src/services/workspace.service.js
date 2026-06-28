import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
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
    async createWorkspace(userId, workspaceData) {
        const { name, description } = workspaceData;
        // Crear workspace
        const workspace = await workspaceRepository.create(name, description || null);

        // Agregar usuario como owner del workspace
        await workspaceMemberRepository.create(
            userId,
            workspace._id,
            MEMBER_WORKSPACE_ROLES.OWNER
        );

        // Crear canal general automáticamente
        await workspaceChannelRepository.create(
            workspace._id,
            'general',
            'Canal general del workspace'
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

        const activeWorkspaces = memberships.filter(membership => membership.workspace_estado);
        return activeWorkspaces.length > 0 ? activeWorkspaces : null;
    }

    /**
     * Obtiene información de un workspace específico
     */
    async getWorkspaceById(workspaceId) {
        const workspace = await workspaceRepository.getById(workspaceId);

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
    async updateWorkspace(workspaceId, updateData) {
        const { name, description } = updateData;

        const dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
        }
        if (description !== undefined) {
            dataToUpdate.description = description;
        }

        const updated_workspace = await workspaceRepository.updateById(
            workspaceId,
            dataToUpdate
        );
        const workspace = await workspaceRepository.getById(workspaceId);

        return {
            _id: workspace._id,
            name: workspace.name,
            description: workspace.description
        };
    }

    /**
     * Elimina un workspace (soft delete)
     */
    async deleteWorkspace(workspaceId) {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ServerError('Workspace no encontrado', 404);
        }

        // Marcar como inactivo (soft delete)
        await workspaceRepository.softDeleteById(workspaceId);
    }
}

export default new WorkspaceService();


