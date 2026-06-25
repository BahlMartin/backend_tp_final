import mongoose from "mongoose";
import {WORKSPACE_MEMBER_COLLECTION_NAME} from "./workspaceMembers.model.js";
import {WORKSPACE_CHANNEL_COLLECTION_NAME} from "./workspaceChannel.model.js";

const channelMemberSchema = new mongoose.Schema({
    fk_workspace_channel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WORKSPACE_CHANNEL_COLLECTION_NAME,
        required: true
    },
    fk_workspace_member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WORKSPACE_MEMBER_COLLECTION_NAME,
        required: true
    },
    join_date: {
        type: Date,
        default: Date.now
    }
});

export const CHANNEL_MEMBER_COLLECTION_NAME = 'channelMember';
const ChannelMember = mongoose.model(CHANNEL_MEMBER_COLLECTION_NAME, channelMemberSchema);

export default ChannelMember;