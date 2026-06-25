import ServerError from '../utils/helpers/serverError.helpers.js';
import invitationWorkspaceRepository from '../repositories/invitationWorkspace.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import { validators } from '../utils/validators/validators.js'
import INVITATION_STATES from '../utils/constants/invitationWorkspaceStates.constants.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import MailService from './mail.service.js';

class InvitationService {
    async createInvitation(userId, workspaceId, invitationData) {
        const { email } = invitationData;

        validators.email(email);

        // Verificar que el usuario invitador es miembro del workspace
        const inviterMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(
            workspaceId,
            userId
        );

        if (!inviterMembership) {
            throw new ServerError('No tienes permiso para invitar miembros', 403);
        }

        // Verificar que no intente invitarse a sí mismo
        const invitedUser = await userRepository.getByEmail(email);
        if (invitedUser && invitedUser._id.toString() === userId) {
            throw new ServerError('No puedes invitarte a ti mismo', 400);
        }

        // Verificar que el usuario no es ya miembro del workspace
        if (invitedUser) {
            const existingMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(
                workspaceId,
                invitedUser._id
            );

            if (existingMembership) {
                throw new ServerError('Este usuario ya es miembro del workspace', 409);
            }
        }

        // Crear invitación
        const invitation = await invitationWorkspaceRepository.create(
            userId,
            invitedUser?._id || null,
            workspaceId,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        );

        // Enviar email de invitación (si es posible)
        try {
            const mailService = new MailService();
            await mailService.sendInvitationEmail(email, invitation._id);
        } catch (error) {
            console.error('Error enviando email de invitación:', error);
        }

        return {
            _id: invitation._id,
            invited_email: email,
            status: INVITATION_STATES.PENDING
        };
    }

    async respondInvitation(invitationId, userId, decision) {
        if (!['accept', 'reject'].includes(decision)) {
            throw new ServerError('Decisión inválida. Use "accept" o "reject"', 400);
        }

        const invitation = await invitationWorkspaceRepository.getInvitationById(invitationId);

        if (!invitation) {
            throw new ServerError('Invitación no encontrada', 404);
        }

        if (decision === 'accept') {
            // Cambiar estado a accepted y crear membership
            await invitationWorkspaceRepository.updateInvitation(invitationId, {
                state: INVITATION_STATES.ACCEPTED
            });

            // Crear membership como MEMBER
            await workspaceMemberRepository.create(userId, invitation.fk_workspace_id, MEMBER_WORKSPACE_ROLES.MEMBER);

            return {
                _id: invitation._id,
                status: INVITATION_STATES.ACCEPTED,
                message: 'Invitación aceptada'
            };
        } else {
            // Cambiar estado a rejected
            await invitationWorkspaceRepository.updateInvitation(invitationId, {
                state: INVITATION_STATES.REJECTED
            });

            return {
                _id: invitation._id,
                status: INVITATION_STATES.REJECTED,
                message: 'Invitación rechazada'
            };
        }
    }
}

export default new InvitationService();
