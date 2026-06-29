import ServerError from '../utils/helpers/serverError.helpers.js';
import invitationWorkspaceRepository from '../repositories/invitationWorkspace.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import INVITATION_STATES from '../utils/constants/invitationWorkspaceStates.constants.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import mailService from './mail.service.js';

class InvitationService {
    async createInvitation(user_id, workspace_id, invitation_data, preloaded_workspace = null, preloaded_membership = null) {
        const { email } = invitation_data;

        // Verificar que el usuario invitador es miembro del workspace
        const inviter_membership = preloaded_membership || await workspaceMemberRepository.getByUserAndWorkspaceId(
            user_id,
            workspace_id
        );

        //si el usuario no es miembro del workspace, no puede invitar
        if (!inviter_membership) {
            throw new ServerError('No sos un usuario del espacio de trabajo', 401);
        }

        //si es member no puede invitar 
        if (inviter_membership.rol === MEMBER_WORKSPACE_ROLES.MEMBER) {
            throw new ServerError('No tenes permisos para invitar usuarios', 403);
        }

        // Verificar que no intente invitarse a sí mismo
        const invited_user = await userRepository.getByEmail(email);
        if (!invited_user) {
            throw new ServerError('El usuario no existe', 404);
        }
        // el usuario no esta activo
        if (invited_user.active !== true) {
            throw new ServerError('El usuario no se encuentra activo', 403);
        }
        // el usuario no tiene verificado el mail
        if (invited_user.verification_email !== true) {
            throw new ServerError('El usuario no tiene verificado su correo electrónico', 403);
        }
        // usuario que esta invitando y que quiere invitar es el mismo
        if (invited_user._id.toString() === user_id) {
            throw new ServerError('No puedes invitarte a ti mismo', 400);
        }
        // Verificar que el usuario no es ya miembro del workspace
        if (invited_user) {
            const existing_membership = await workspaceMemberRepository.getByUserAndWorkspaceId(
                invited_user._id,
                workspace_id
            );

            if (existing_membership) {
                throw new ServerError('Este usuario ya es miembro del workspace', 409);
            }

            // Verificar si ya existe una invitación vigente en estado pending del mismo inviter al mismo usuario en el mismo workspace
            const existing_invitation = await invitationWorkspaceRepository.getInvitationByInviterInvitedAndWorkspace(
                user_id,
                invited_user._id,
                workspace_id
            );

            if (existing_invitation && existing_invitation.status === INVITATION_STATES.PENDING) {
                throw new ServerError('Ya existe una invitación pendiente para este usuario en este workspace', 409);
            }
        }

        // Crear invitación
        const invitation = await invitationWorkspaceRepository.create(
            user_id,
            invited_user._id,
            workspace_id,
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        );

        // Obtener datos del invitador y del workspace para el email
        const inviter = await userRepository.getById(user_id);
        const workspace = preloaded_workspace || await workspaceRepository.getById(workspace_id);

        // Enviar email de invitación
        try {
            await mailService.sendInvitationEmail(
                email,
                invitation._id,
                inviter.user_name,
                workspace.name
            );
        } catch (error) {
            console.error('Error enviando email de invitación:', error);
        }

        return {
            _id: invitation._id,
            status: INVITATION_STATES.PENDING
        };
    }

    async respondInvitation(invitation_id, user_id, decision, preloaded_invitation = null) {


        const invitation = preloaded_invitation || await invitationWorkspaceRepository.getInvitationById(invitation_id);

        if (!invitation || invitation.fk_invited_user_id.toString() !== user_id) {
            throw new ServerError('No tenes invitaciones de este espacio de trabajo', 404);
        }
        // el usuario no tiene que aceptar su propia invitacion
        if (invitation.fk_inviter_user_id.toString() === user_id) {
            throw new ServerError('No puedes aceptar tu propia invitación', 400);
        }

        if (decision === INVITATION_STATES.ACCEPTED) {
            // Cambiar estado a accepted y crear membership
            await invitationWorkspaceRepository.updateInvitation(invitation_id, {
                status: INVITATION_STATES.ACCEPTED
            });

            // Crear membership como MEMBER
            await workspaceMemberRepository.create(user_id, invitation.fk_workspace_id, MEMBER_WORKSPACE_ROLES.MEMBER);

            return {
                _id: invitation._id,
                status: INVITATION_STATES.ACCEPTED,
                message: 'Invitación aceptada'
            };
        } else {
            // Cambiar estado a rejected
            await invitationWorkspaceRepository.updateInvitation(invitation_id, {
                status: INVITATION_STATES.REJECTED
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
