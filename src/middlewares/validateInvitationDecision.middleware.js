import ServerError from '../utils/helpers/serverError.helpers.js';
import invitationWorkspaceRepository from '../repositories/invitationWorkspace.repository.js';
import INVITATION_STATES from '../utils/constants/invitationWorkspaceStates.constants.js';

async function validateInvitationDecisionMiddleware(req, res, next) {
    try {
        const { invitation_id } = req.params;

        const invitation = await invitationWorkspaceRepository.findById(invitation_id);

        if (!invitation) {
            throw new ServerError('Invitación no encontrada', 404);
        }

        if (invitation.state !== INVITATION_STATES.PENDING) {
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
