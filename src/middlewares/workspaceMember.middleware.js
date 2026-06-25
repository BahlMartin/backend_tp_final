import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';

function workspaceMemberMiddleware(requiredRoles = []) {
    return async (req, res, next) => {
        try {
            const { workspace_id } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                throw new ServerError('Usuario no autenticado', 401);
            }

            // Verificar que el workspace existe
            const workspace = await workspaceRepository.getById(workspace_id);
            if (!workspace) {
                throw new ServerError('Workspace no encontrado', 404);
            }

            // Verificar que el usuario es miembro activo del workspace
            const membership = await workspaceMemberRepository.getByUserAndWorkspaceId(workspace_id, userId);

            if (!membership || !membership.active) {
                throw new ServerError(
                    'No tienes permiso para acceder a este workspace',
                    403
                );
            }

            // Verificar roles requeridos si están especificados
            if (requiredRoles.length > 0 && !requiredRoles.includes(membership.rol)) {
                throw new ServerError(
                    'No tienes el rol necesario para realizar esta acción',
                    403
                );
            }

            // Adjuntar al request
            req.workspace = workspace;
            req.workspaceMembership = membership;

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default workspaceMemberMiddleware;
