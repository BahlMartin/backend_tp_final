import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import validateInvitationDecisionMiddleware from '../middlewares/validateInvitationDecision.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import invitationController from '../controllers/invitation.controller.js';

const invitation_router = express.Router();

const invitationDecisionSchema = {
    decision: { required: true }
};

// Aplicar authMiddleware a todas las rutas
invitation_router.use(authMiddleware);

// PUT /api/invitations/:invitation_id
invitation_router.put(
    '/:invitation_id',
    validateObjectIdMiddleware('invitation_id'),
    validateInvitationDecisionMiddleware,
    validateBodyMiddleware(invitationDecisionSchema),
    invitationController.respondInvitation
);

export default invitation_router;
