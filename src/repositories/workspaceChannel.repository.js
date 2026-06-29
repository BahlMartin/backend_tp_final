import WorkspaceChannel from '../models/workspaceChannel.model.js';

class WorkspaceChannelRepository {

    async create(workspace_id, name, description) {
        return await WorkspaceChannel.create({
            fk_workspace_id: workspace_id,
            name,
            description
        });
    }

    async getById(workspace_id, channel_id) {
        return await WorkspaceChannel.findOne({
            fk_workspace_id: workspace_id,
            _id: channel_id
        });
    }

    async getByChannelId(channel_id) {
        return await WorkspaceChannel.findById(channel_id);
    }

    async getByWorkspaceId(workspace_id) {
        return await WorkspaceChannel.find({
            fk_workspace_id: workspace_id
        });
    }

    async hardDeleteById(workspace_id, channel_id) {
        return await WorkspaceChannel.findOneAndDelete({
            fk_workspace_id: workspace_id,
            _id: channel_id
        });
    }

    async updateById(workspace_id, channel_id, data) {
        return await WorkspaceChannel.findOneAndUpdate({
            fk_workspace_id: workspace_id,
            _id: channel_id
        }, data, { returnDocument: 'after' });
    }


}

export const workspaceChannelRepository = new WorkspaceChannelRepository();
export default workspaceChannelRepository;