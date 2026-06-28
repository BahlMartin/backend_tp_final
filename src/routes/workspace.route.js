import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import workspaceMemberMiddleware from '../middlewares/workspaceMember.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import workspaceController from '../controllers/workspace.controller.js';
import invitationController from '../controllers/invitation.controller.js';
import workspaceMemberController from '../controllers/workspaceMember.controller.js';
import channelController from '../controllers/channel.controller.js';
import {
    workspaceSchema,
    invitationSchema,
    memberUpdateSchema,
    channelSchema
} from '../utils/schemas/workspace.schema.js';

const workspace_router = express.Router();

// Aplicar authMiddleware a todas las rutas
workspace_router.use(authMiddleware);


workspace_router.post('/', validateBodyMiddleware(workspaceSchema), workspaceController.createWorkspace);


workspace_router.get('/', workspaceController.getMyWorkspaces);

workspace_router.get('/:workspace_id', validateObjectIdMiddleware('workspace_id'), workspaceMemberMiddleware(), workspaceController.getWorkspaceById);

workspace_router.put(
    '/:workspace_id',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    validateBodyMiddleware(workspaceSchema),
    workspaceController.updateWorkspace
);


workspace_router.delete(
    '/:workspace_id',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteWorkspace
);


workspace_router.post(
    '/:workspace_id/invitations',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    validateBodyMiddleware(invitationSchema),
    invitationController.createInvitation
);


workspace_router.get(
    '/:workspace_id/members',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware(),
    workspaceMemberController.getMembers
);

workspace_router.patch(
    '/:workspace_id/members/:member_id',
    validateObjectIdMiddleware('workspace_id'),
    validateObjectIdMiddleware('member_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    validateBodyMiddleware(memberUpdateSchema),
    workspaceMemberController.updateMemberRole
);


workspace_router.delete(
    '/:workspace_id/members/:member_id',
    validateObjectIdMiddleware('workspace_id'),
    validateObjectIdMiddleware('member_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    workspaceMemberController.removeMember
);

workspace_router.post(
    '/:workspace_id/channels',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    validateBodyMiddleware(channelSchema),
    channelController.createChannel
);


workspace_router.get(
    '/:workspace_id/channels',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware(),
    channelController.getChannels
);

workspace_router.delete(
    '/:workspace_id/channels/:channel_id',
    validateObjectIdMiddleware('workspace_id'),
    validateObjectIdMiddleware('channel_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    channelController.deleteChannel
);

export default workspace_router;