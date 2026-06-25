import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import channelMembershipMiddleware from '../middlewares/channelMembership.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import { validators } from '../utils/validators/validators.js'
import attachMessageMiddleware from '../middlewares/attachMessage.middleware.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import channelController from '../controllers/channel.controller.js';
import channelMemberController from '../controllers/channelMember.controller.js';
import messageController from '../controllers/message.controller.js';

const channel_router = express.Router();

const messageSchema = {
    content: { required: true }
};

const channelMemberSchema = {
    user_id: { required: true }
};

// Aplicar authMiddleware a todas las rutas
channel_router.use(authMiddleware);

// GET /api/channels/:channel_id
channel_router.get(
    '/:channel_id',
    validateObjectIdMiddleware('channel_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requireWorkspaceMember: true })(req, res, next);
    },
    channelController.getChannelById
);

// DELETE /api/channels/:channel_id
channel_router.delete(
    '/:channel_id',
    validateObjectIdMiddleware('channel_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requiredRoles: [MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN] })(req, res, next);
    },
    channelController.deleteChannel
);

// GET /api/channels/:channel_id/messages
channel_router.get(
    '/:channel_id/messages',
    validateObjectIdMiddleware('channel_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requireChannelMember: true })(req, res, next);
    },
    messageController.getMessages
);

// POST /api/channels/:channel_id/messages
channel_router.post(
    '/:channel_id/messages',
    validateObjectIdMiddleware('channel_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requireChannelMember: true })(req, res, next);
    },
    validateBodyMiddleware(messageSchema),
    messageController.createMessage
);

// PUT /api/messages/:message_id
channel_router.put(
    '/messages/:message_id',
    validateObjectIdMiddleware('message_id'),
    attachMessageMiddleware,
    validateBodyMiddleware(messageSchema),
    messageController.updateMessage
);

// DELETE /api/messages/:message_id
channel_router.delete(
    '/messages/:message_id',
    validateObjectIdMiddleware('message_id'),
    attachMessageMiddleware,
    messageController.deleteMessage
);

// POST /api/channels/:channel_id/members
channel_router.post(
    '/:channel_id/members',
    validateObjectIdMiddleware('channel_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requiredRoles: [MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN] })(req, res, next);
    },
    validateBodyMiddleware(channelMemberSchema),
    channelMemberController.addMember
);

// DELETE /api/channels/:channel_id/members/:member_id
channel_router.delete(
    '/:channel_id/members/:member_id',
    validateObjectIdMiddleware('channel_id'),
    validateObjectIdMiddleware('member_id'),
    (req, res, next) => {
        return channelMembershipMiddleware({ requiredRoles: [MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN] })(req, res, next);
    },
    channelMemberController.removeMember
);

export default channel_router;
