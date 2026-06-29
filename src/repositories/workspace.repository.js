import Workspace from '../models/workspace.model.js';

class WorkspaceRepository {

    async create(name, description) {
        return await Workspace.create({
            name,
            description,
        });
    }

    async getById(workspace_id) {
        return await Workspace.findById(workspace_id);
    }

    async softDeleteById(workspace_id) {
        return await Workspace.findByIdAndUpdate(workspace_id, { active: false });
    }

    async updateById(workspace_id, update_data) {
        return await Workspace.findByIdAndUpdate(workspace_id, update_data, { returnDocument: 'after' });
    }

}

export const workspaceRepository = new WorkspaceRepository();
export default workspaceRepository;