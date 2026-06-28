import ServerError from '../utils/helpers/serverError.helpers.js';
import invitationWorkspaceRepository from '../repositories/invitationWorkspace.repository.js';
import INVITATION_STATES from '../utils/constants/invitationWorkspaceStates.constants.js';

async function validateInvitationDecisionMiddleware(req, res, next) {
    try {
        const { invitation_id, decision } = req.params;

        if (decision !== INVITATION_STATES.ACCEPTED && decision !== INVITATION_STATES.REJECTED) {
            throw new ServerError('Decisión inválida. Debe ser accepted o rejected', 400);
        }

        const invitation = await invitationWorkspaceRepository.getInvitationById(invitation_id);
        if (!invitation) {
            throw new ServerError('Invitación no encontrada', 404);
        }

        if (invitation.status !== INVITATION_STATES.PENDING) {
            throw new ServerError(
                'La invitación ya ha sido respondida',
                409
            );
        }

        req.invitation = invitation;

        next();
    } catch (error) {
        next(error);
    }
}

export default validateInvitationDecisionMiddleware;
