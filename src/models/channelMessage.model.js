import mongoose from "mongoose";
import { WORKSPACE_CHANNEL_COLLECTION_NAME } from "./workspaceChannel.model.js";
import { CHANNEL_MEMBER_COLLECTION_NAME } from "./channelMember.model.js";

const channelMessageSchema = new mongoose.Schema({
    fk_workspace_channel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WORKSPACE_CHANNEL_COLLECTION_NAME,
        required: true
    },
    fk_channel_member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CHANNEL_MEMBER_COLLECTION_NAME,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    modification_date: {
        type: Date,
        default: null
    }
});

export const CHANNEL_MESSAGE_COLLECTION_NAME = 'channelMessage';
const ChannelMessage = mongoose.model(CHANNEL_MESSAGE_COLLECTION_NAME, channelMessageSchema);

export default ChannelMessage;


