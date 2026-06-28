import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import channelMembershipMiddleware from '../middlewares/channelMembership.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import attachMessageMiddleware from '../middlewares/attachMessage.middleware.js';
import messagePermissionMiddleware from '../middlewares/messagePermission.middleware.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import channelController from '../controllers/channel.controller.js';
import channelMemberController from '../controllers/channelMember.controller.js';
import messageController from '../controllers/message.controller.js';
import { messageSchema, channelMemberSchema } from '../utils/schemas/channel.schema.js';

const channel_router = express.Router();

channel_router.use(authMiddleware);


channel_router.get(
    '/:channel_id',
    validateObjectIdMiddleware('channel_id'),
    channelMembershipMiddleware({ require_workspace_member: true, require_channel_member: true }),
    channelController.getChannelById
);


channel_router.get(
    '/:channel_id/messages',
    validateObjectIdMiddleware('channel_id'),
    channelMembershipMiddleware({ require_channel_member: true }),
    messageController.getMessages
);

channel_router.post(
    '/:channel_id/messages',
    validateObjectIdMiddleware('channel_id'),
    channelMembershipMiddleware({ require_channel_member: true }),
    validateBodyMiddleware(messageSchema),
    messageController.createMessage
);

channel_router.put(
    '/messages/:message_id',
    validateObjectIdMiddleware('message_id'),
    attachMessageMiddleware,
    messagePermissionMiddleware,
    validateBodyMiddleware(messageSchema),
    messageController.updateMessage
);


channel_router.delete(
    '/messages/:message_id',
    validateObjectIdMiddleware('message_id'),
    attachMessageMiddleware,
    messagePermissionMiddleware,
    messageController.deleteMessage
);


channel_router.post(
    '/:channel_id/members',
    validateObjectIdMiddleware('channel_id'),
    channelMembershipMiddleware({ required_roles: [MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN] }),
    validateBodyMiddleware(channelMemberSchema),
    channelMemberController.addMember
);

channel_router.delete(
    '/:channel_id/members/:member_id',
    validateObjectIdMiddleware('channel_id'),
    validateObjectIdMiddleware('member_id'),
    channelMembershipMiddleware({ required_roles: [MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN] }),
    channelMemberController.removeMember
);

channel_router.get(
    '/:channel_id/members',
    validateObjectIdMiddleware('channel_id'),
    channelMembershipMiddleware({ require_channel_member: true }),
    channelMemberController.getChannelMembers
);

export default channel_router;
