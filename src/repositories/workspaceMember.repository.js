import WorkspaceMember from "../models/workspaceMembers.model.js"

class WorkspaceMemberRepository {
    async create(user_id, workspace_id, role) {
        const new_membership = await WorkspaceMember.create({
            fk_workspace_id: workspace_id,
            fk_user_id: user_id,
            rol: role
        })
        return new_membership

    }

    async getByUserAndWorkspaceId(user_id, workspace_id) {
        const membership = await WorkspaceMember.findOne({
            fk_user_id: user_id,
            fk_workspace_id: workspace_id
        })
        return membership
    }

    async getByUserId(user_id) {
        const result = await WorkspaceMember.find({ fk_user_id: user_id, active: true }).populate({
            path: 'fk_workspace_id',
            select: 'name description active',
            match: { active: true }
        })


        return result.filter(membership => membership.fk_workspace_id).map(membership => ({
            member_id: membership._id,
            member_rol: membership.rol,
            member_fecha_creacion: membership.fecha_creacion,
            workspace_id: membership.fk_workspace_id._id,
            workspace_nombre: membership.fk_workspace_id.name,
            workspace_descripcion: membership.fk_workspace_id.description,
            workspace_estado: membership.fk_workspace_id.active
        })
        )
    }

    async getMembersByWorkspaceId(workspace_id) {
        const result = await WorkspaceMember.find({
            fk_workspace_id: workspace_id,
            active: true
        }).populate({
            path: 'fk_user_id',
            select: 'user_name email',
            match: { active: true }
        })
        // si el usuario esta desactivado no se muestra
        const activeMembers = result.filter(member => member.fk_user_id);
        const members_mapped = activeMembers.map(
            (member) => ({
                member_id: member._id,
                member_rol: member.rol,
                member_email: member.fk_user_id.email,
                member_nombre: member.fk_user_id.user_name,
                member_id_workspace: member.fk_workspace_id
            })
        )
        return members_mapped
    }

    async updateById(member_id, update) {
        return await WorkspaceMember.findByIdAndUpdate(member_id, update, { returnDocument: 'after' })
    }

    async deleteById(member_id) {
        return await WorkspaceMember.findByIdAndDelete(member_id)
    }

    async getByMemberId(member_id) {
        return await WorkspaceMember.findById(member_id)
    }

    async getWorkspaceOwner(workspace_id) {
        return await WorkspaceMember.findOne({
            fk_workspace_id: workspace_id,
            rol: 'owner',
            active: true
        });
    }

}

export const workspaceMemberRepository = new WorkspaceMemberRepository();

export default workspaceMemberRepository;



