import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateObjectIdMiddleware from '../middlewares/validateObjectId.middleware.js';
import workspaceMemberMiddleware from '../middlewares/workspaceMember.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import { validators } from '../utils/validators/validators.js'
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import workspaceController from '../controllers/workspace.controller.js';
import invitationController from '../controllers/invitation.controller.js';
import workspaceMemberController from '../controllers/workspaceMember.controller.js';
import channelController from '../controllers/channel.controller.js';

const workspace_router = express.Router();

const workspaceSchema = {
    name: { required: true, validate: validators.workspaceName },
    description: { required: false }
};

const invitationSchema = {
    email: { required: true, validate: validators.email }
};

const memberUpdateSchema = {
    rol: { required: true }
};

const channelSchema = {
    name: { required: true, validate: validators.channelName },
    description: { required: false }
};

// Aplicar authMiddleware a todas las rutas
workspace_router.use(authMiddleware);

// POST /api/workspaces
workspace_router.post(
    '/',
    validateBodyMiddleware(workspaceSchema),
    workspaceController.createWorkspace
);

// GET /api/workspaces
workspace_router.get('/', workspaceController.getMyWorkspaces);

// GET /api/workspaces/:workspace_id
workspace_router.get(
    '/:workspace_id',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware(),
    workspaceController.getWorkspaceById
);

// PUT /api/workspaces/:workspace_id
workspace_router.put(
    '/:workspace_id',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    validateBodyMiddleware(workspaceSchema),
    workspaceController.updateWorkspace
);

// DELETE /api/workspaces/:workspace_id
workspace_router.delete(
    '/:workspace_id',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteWorkspace
);

// POST /api/workspaces/:workspace_id/invitations
workspace_router.post(
    '/:workspace_id/invitations',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    validateBodyMiddleware(invitationSchema),
    invitationController.createInvitation
);

// GET /api/workspaces/:workspace_id/members
workspace_router.get(
    '/:workspace_id/members',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware(),
    workspaceMemberController.getMembers
);

// PATCH /api/workspaces/:workspace_id/members/:member_id
workspace_router.patch(
    '/:workspace_id/members/:member_id',
    validateObjectIdMiddleware('workspace_id'),
    validateObjectIdMiddleware('member_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    validateBodyMiddleware(memberUpdateSchema),
    workspaceMemberController.updateMemberRole
);

// DELETE /api/workspaces/:workspace_id/members/:member_id
workspace_router.delete(
    '/:workspace_id/members/:member_id',
    validateObjectIdMiddleware('workspace_id'),
    validateObjectIdMiddleware('member_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    workspaceMemberController.removeMember
);

// POST /api/workspaces/:workspace_id/channels
workspace_router.post(
    '/:workspace_id/channels',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    validateBodyMiddleware(channelSchema),
    channelController.createChannel
);

// GET /api/workspaces/:workspace_id/channels
workspace_router.get(
    '/:workspace_id/channels',
    validateObjectIdMiddleware('workspace_id'),
    workspaceMemberMiddleware(),
    channelController.getChannels
);

export default workspace_router;