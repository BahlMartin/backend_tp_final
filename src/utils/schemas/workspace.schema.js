import { validators } from '../validators/validators.js';

export const workspaceSchema = {
    name: { required: true, validate: validators.workspaceName },
    description: { required: false, validate: validators.workspaceDescription }
};

export const invitationSchema = {
    email: { required: true, validate: validators.email }
};

export const memberUpdateSchema = {
    rol: { required: true }
};

export const channelSchema = {
    name: { required: true, validate: validators.channelName },
    description: { required: false, validate: validators.channelDescription }
};

export default {
    workspaceSchema,
    invitationSchema,
    memberUpdateSchema,
    channelSchema
};
