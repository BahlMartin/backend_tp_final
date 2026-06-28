import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import validateInvitationDecisionMiddleware from '../middlewares/validateInvitationDecision.middleware.js';
import invitationController from '../controllers/invitation.controller.js';

const invitation_router = express.Router();

// Aplicar authMiddleware a todas las rutas
invitation_router.use(authMiddleware);


invitation_router.put(
    '/:invitation_id/:decision',
    validateObjectIdMiddleware('invitation_id'),
    validateInvitationDecisionMiddleware,
    invitationController.respondInvitation
);

export default invitation_router;
