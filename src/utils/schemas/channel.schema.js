import { validators } from '../validators/validators.js';

export const messageSchema = {
    content: { required: true, validate: validators.messageContent }
};

export const channelMemberSchema = {
    member_id: { required: true, validate: validators.objectId }
};
