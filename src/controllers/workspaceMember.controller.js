import workspaceMemberService from '../services/workspaceMember.service.js';

const workspaceMemberController = {
    async getMembers(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const result = await workspaceMemberService.getWorkspaceMembers(workspace_id);

            return res.status(200).json({
                ok: true,
                message: 'Miembros obtenidos',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateMemberRole(req, res, next) {
        try {
            const { workspace_id, member_id } = req.params;
            const userId = req.user.userId;
            const result = await workspaceMemberService.updateMemberRole(
                userId,
                workspace_id,
                member_id,
                req.body
            );

            return res.status(200).json({
                ok: true,
                message: 'Rol actualizado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async removeMember(req, res, next) {
        try {
            const { workspace_id, member_id } = req.params;
            const userId = req.user.userId;
            await workspaceMemberService.removeMember(userId, workspace_id, member_id);

            return res.status(200).json({
                ok: true,
                message: 'Miembro eliminado',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};

export default workspaceMemberController;
