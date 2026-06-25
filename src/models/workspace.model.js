import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
})

export const WORKSPACE_COLLECTION_NAME = 'workspace';
const Workspace = mongoose.model(WORKSPACE_COLLECTION_NAME, workspaceSchema);

export default Workspace;