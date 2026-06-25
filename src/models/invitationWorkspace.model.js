import mongoose from 'mongoose';
import { USER_COLLECTION_NAME } from "./user.model.js";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";
import MEMBER_INVITATION_STATUS from "../utils/constants/invitationWorkspaceStates.constants.js";

const invitationWorkspaceSchema = new mongoose.Schema({
    
    fk_invited_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
        required: true
    },
    fk_inviter_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
        required: true
    },
    fk_workspace_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WORKSPACE_COLLECTION_NAME,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: [MEMBER_INVITATION_STATUS.PENDING, MEMBER_INVITATION_STATUS.ACCEPTED, MEMBER_INVITATION_STATUS.REJECTED],
        default: MEMBER_INVITATION_STATUS.PENDING,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    }
})

export const INVITATION_WORKSPACE_COLLECTION_NAME = 'invitationWorkspace';
const InvitationWorkspace = mongoose.model(INVITATION_WORKSPACE_COLLECTION_NAME, invitationWorkspaceSchema);

export default InvitationWorkspace;