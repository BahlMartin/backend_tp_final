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
            const user_id = req.user.user_id;
            const result = await workspaceMemberService.updateMemberRole(
                user_id,
                workspace_id,
                member_id,
                req.body,
                req.workspaceMembership
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
            const user_id = req.user.user_id;
            await workspaceMemberService.removeMember(
                user_id,
                workspace_id,
                member_id,
                req.workspaceMembership
            );

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
