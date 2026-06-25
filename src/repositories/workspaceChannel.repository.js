import mongoose from 'mongoose';
import WorkspaceChannel from '../models/workspaceChannel.model.js';

class WorkspaceChannelRepository {

    async create(workspaceId, name, description) {
        return await WorkspaceChannel.create({
            fk_workspace_id: workspaceId,
            name,
            description
        });
    }

    async getById(workspaceId, channelId) {
        return await WorkspaceChannel.findOne({
            fk_workspace_id: workspaceId,
            _id: channelId
        });
    }

    async getByWorkspaceId(workspaceId) {
        return await WorkspaceChannel.find({
            fk_workspace_id: workspaceId
        });
    }

    async hardDeleteById(workspaceId, channelId) {
        return await WorkspaceChannel.findOneAndDelete({
            fk_workspace_id: workspaceId,
            _id: channelId
        });
    }


}

export const workspaceChannelRepository = new WorkspaceChannelRepository();
export default workspaceChannelRepository;