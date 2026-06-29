import invitationService from '../services/invitation.service.js';

const invitationController = {
    async createInvitation(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const user_id = req.user.user_id;
            const result = await invitationService.createInvitation(
                user_id,
                workspace_id,
                req.body,
                req.workspace,
                req.workspaceMembership
            );

            return res.status(201).json({
                ok: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async respondInvitation(req, res, next) {
        try {
            const { invitation_id, decision } = req.params;
            const user_id = req.user.user_id;

            const result = await invitationService.respondInvitation(
                invitation_id,
                user_id,
                decision,
                req.invitation
            );

            return res.status(200).json({
                ok: true,
                message: `Invitación ${decision}`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default invitationController;
