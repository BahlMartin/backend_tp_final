import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

class WorkspaceMemberService {
    async getWorkspaceMembers(workspaceId) {
        const members = await workspaceMemberRepository.getMembersByWorkspaceId(workspaceId);
        return members;
    }

    async updateMemberRole(userId, workspaceId, memberId, updateData) {
        const { rol } = updateData;

        if (!Object.values(MEMBER_WORKSPACE_ROLES).includes(rol)) {
            throw new ServerError('Rol inválido', 400);
        }

        // Verificar que el usuario actual es owner
        const currentMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(userId, workspaceId);

        if (!currentMembership || currentMembership.rol !== MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('Solo el owner puede cambiar roles', 403);
        }

        // Actualizar rol
        const updatedMember = await workspaceMemberRepository.updateById(memberId, { rol });

        return {
            _id: updatedMember._id,
            fk_user_id: updatedMember.fk_user_id,
            rol: updatedMember.rol
        };
    }

    async removeMember(userId, workspaceId, memberId) {
        // Verificar que el usuario actual es owner o admin
        const currentMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(userId, workspaceId);

        if (!currentMembership || ![MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN].includes(currentMembership.rol)) {
            throw new ServerError('No tienes permiso para eliminar miembros', 403);
        }

        // Marcar como inactivo
        await workspaceMemberRepository.updateById(memberId, { active: false });
    }
}

export default new WorkspaceMemberService();
