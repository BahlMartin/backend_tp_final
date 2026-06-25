import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceChannelRepository from '../repositories/workspaceChannel.repository.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';

async function channelMembershipMiddleware(options = {}) {
    const {
        requireWorkspaceMember = false,
        requireChannelMember = false,
        requiredRoles = []
    } = options;

    return async (req, res, next) => {
        try {
            const { channel_id } = req.params;
            const userId = req.user?.userId;

            if (!userId) {
                throw new ServerError('Usuario no autenticado', 401);
            }

            // Cargar el canal
            const channels = await workspaceChannelRepository.getByWorkspaceId(null);
            const channel = channels?.find(c => c._id.toString() === channel_id);

            if (!channel) {
                throw new ServerError('Canal no encontrado', 404);
            }

            const workspaceId = channel.fk_workspace_id;

            // Verificar pertenencia al workspace si se requiere
            if (requireWorkspaceMember || requireChannelMember || requiredRoles.length > 0) {
                const workspaceMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(workspaceId, userId);

                if (!workspaceMembership || !workspaceMembership.active) {
                    throw new ServerError(
                        'No tienes permiso para acceder a este canal',
                        403
                    );
                }

                // Verificar roles en workspace si se requiere
                if (requiredRoles.length > 0 && !requiredRoles.includes(workspaceMembership.rol)) {
                    throw new ServerError(
                        'No tienes el rol necesario para realizar esta acción',
                        403
                    );
                }

                req.workspaceMembership = workspaceMembership;
            }

            // Verificar pertenencia al canal si se requiere
            if (requireChannelMember) {
                const members = await channelMemberRepository.getMembersByChannelId(channel_id);
                const isMember = members?.some(m => m.member_email === workspaceMembership?.fk_user_id?.email);

                if (!isMember) {
                    throw new ServerError(
                        'No eres miembro de este canal',
                        403
                    );
                }
            }

            // Adjuntar canal al request
            req.channel = channel;

            next();
        } catch (error) {
            next(error);
        }
    };
}

export default channelMembershipMiddleware;
