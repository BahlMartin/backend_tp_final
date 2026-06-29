import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

/**
 * Middleware para validar membresías y roles en canales y workspaces.
 * @param {Object} options Opciones de validación
 * @param {boolean} options.require_workspace_member Requiere que el usuario sea miembro del workspace
 * @param {boolean} options.require_channel_member Requiere que el usuario sea miembro del canal
 * @param {boolean} options.allow_owner_bypass Permite a los OWNER saltarse la regla de pertenencia al canal
 * @param {string[]} options.required_roles Array de roles permitidos en el workspace
 */
function channelMembershipMiddleware(options = {}) {
    const {
        require_workspace_member = false,
        require_channel_member = false,
        allow_owner_bypass = false,
        required_roles = []
    } = options;

    return async (req, res, next) => {
        try {
            const { channel_id } = req.params;
            const user_id = req.user.user_id;

            if (!user_id) {
                throw new ServerError('Usuario no autenticado', 401);
            }

            // 1. Cargar el canal 
            const channel = await workspaceChannelRepository.getByChannelId(channel_id);
            if (!channel) {
                throw new ServerError('Canal no encontrado', 404);
            }


            const workspace_id = channel.fk_workspace_id;

            // 2. Validar permisos en Workspace (si aplica)
            const needs_workspace_validation = require_workspace_member || require_channel_member || required_roles.length > 0;
            let workspace_membership = req.workspaceMembership || req.workspace_membership || null;

            if (needs_workspace_validation) {
                if (!workspace_membership) {
                    workspace_membership = await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);
                }

                if (!workspace_membership || !workspace_membership.active) {
                    throw new ServerError('No tienes permiso para acceder a este workspace', 403);
                }

                if (required_roles.length > 0 && !required_roles.includes(workspace_membership.rol)) {
                    throw new ServerError('No tienes el rol necesario para realizar esta acción', 403);
                }

                req.workspace_membership = workspace_membership;
            }

            // 3. Validar permisos en el Canal (si aplica)
            if (require_channel_member) {
                const is_owner = workspace_membership && workspace_membership.rol === MEMBER_WORKSPACE_ROLES.OWNER;
                const should_bypass = allow_owner_bypass && is_owner;

                if (!should_bypass) {
                    const members = await channelMemberRepository.getMembersByChannelId(channel_id);
                    const matched_member = members.find(member => member.workspace_member_id && member.workspace_member_id.toString() === workspace_membership._id.toString());

                    if (!matched_member) {
                        throw new ServerError('No eres miembro de este canal', 403);
                    }

                    req.channel_membership = matched_member;
                }
            }

            req.channel = channel

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default channelMembershipMiddleware;
