import mongoose from "mongoose";
import { WORKSPACE_COLLECTION_NAME } from "./workspace.model.js";

const workspaceChannelSchema = new mongoose.Schema({
    fk_workspace_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: WORKSPACE_COLLECTION_NAME,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    }
});

export const WORKSPACE_CHANNEL_COLLECTION_NAME = 'workspaceChannel';
const WorkspaceChannel = mongoose.model(WORKSPACE_CHANNEL_COLLECTION_NAME, workspaceChannelSchema);

export default WorkspaceChannel;