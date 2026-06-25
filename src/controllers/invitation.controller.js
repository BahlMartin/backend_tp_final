import invitationService from '../services/invitation.service.js';

const invitationController = {
    async createInvitation(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const userId = req.user.userId;
            const result = await invitationService.createInvitation(
                userId,
                workspace_id,
                req.body
            );

            return res.status(201).json({
                ok: true,
                message: 'Invitación enviada',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async respondInvitation(req, res, next) {
        try {
            const { invitation_id } = req.params;
            const userId = req.user.userId;
            const { decision } = req.body;

            const result = await invitationService.respondInvitation(
                invitation_id,
                userId,
                decision
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
