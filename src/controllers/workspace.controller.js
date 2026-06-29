import workspaceService from '../services/workspace.service.js';

const workspaceController = {
    async createWorkspace(req, res, next) {
        try {
            const user_id = req.user.user_id;
            const result = await workspaceService.createWorkspace(user_id, req.body);

            return res.status(201).json({
                ok: true,
                message: 'Workspace creado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getMyWorkspaces(req, res, next) {
        try {
            const user_id = req.user.user_id;
            const result = await workspaceService.getWorkspacesByUser(user_id);

            return res.status(200).json({
                ok: true,
                message: 'Workspaces obtenidos',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getWorkspaceById(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const result = await workspaceService.getWorkspaceById(workspace_id, req.workspace);

            return res.status(200).json({
                ok: true,
                message: 'Workspace obtenido',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateWorkspace(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const result = await workspaceService.updateWorkspace(workspace_id, req.body);

            return res.status(200).json({
                ok: true,
                message: 'Workspace actualizado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteWorkspace(req, res, next) {
        try {
            const { workspace_id } = req.params;
            await workspaceService.deleteWorkspace(workspace_id, req.workspace);

            return res.status(200).json({
                ok: true,
                message: 'Workspace eliminado',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};

export default workspaceController;
