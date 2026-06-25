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
 * 
 * NO hace:
 * - Validación de formato (responsabilidad de middlewares)
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
            name: workspace.name,
            description: workspace.description,
            creation_date: workspace.creation_date
        };
    }

    /**
     * Obtiene todos los workspaces donde el usuario es miembro
     */
    async getWorkspacesByUser(userId) {
        const memberships = await workspaceMemberRepository.getByUserId(userId);
        return memberships;
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
            description: workspace.description,
            creation_date: workspace.creation_date
        };
    }

    /**
     * Actualiza información del workspace
     * Asume que los datos ya fueron validados por middleware si se envían
     */
    async updateWorkspace(workspaceId, updateData) {
        const { name, description } = updateData;

        const dataToUpdate = {};
        if (name) dataToUpdate.name = name;
        if (description !== undefined) dataToUpdate.descripcion = description;

        const updatedWorkspace = await workspaceRepository.updateById(
            workspaceId,
            dataToUpdate
        );

        return {
            _id: updatedWorkspace._id,
            name: updatedWorkspace.name,
            description: updatedWorkspace.descripcion,
            creation_date: updatedWorkspace.creation_date
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


