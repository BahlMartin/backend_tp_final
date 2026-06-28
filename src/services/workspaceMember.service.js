import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import userRepository from '../repositories/user.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';

class WorkspaceMemberService {
    async getWorkspaceMembers(workspace_id) {
        const members = await workspaceMemberRepository.getMembersByWorkspaceId(workspace_id);
        return members;
    }

    async updateMemberRole(user_id, workspace_id, member_id, updateData) {
        const { rol } = updateData;

        if (!Object.values(MEMBER_WORKSPACE_ROLES).includes(rol)) {
            throw new ServerError('Rol inválido', 400);
        }

        if (rol === MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('No es posible cambiar el rol a owner', 403);
        }
        // Verificar que el usuario actual es owner
        const currentMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);

        if (!currentMembership || currentMembership.rol !== MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('Solo el owner puede cambiar roles', 403);
        }

        //Verificar que el miembro a modificar sea miembro del workspace
        const membership_member = await workspaceMemberRepository.getByUserAndWorkspaceId(member_id, workspace_id);

        if (!membership_member) {
            throw new ServerError('El usuario no es miembro del workspace', 403);
        }

        if (membership_member.rol === MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('No puedes cambiar el rol del owner', 403);
        }


        if (membership_member.rol === rol) {
            throw new ServerError('El usuario ya tiene ese rol', 403);
        }

        // Actualizar rol
        const updatedMember = await workspaceMemberRepository.updateById(membership_member._id, { rol });

        return {
            _id: updatedMember._id,
            rol: updatedMember.rol
        };
    }

    async removeMember(user_id, workspace_id, member_id) {
        // Verificar que el usuario actual es owner o admin
        const currentMembership = await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);

        if (!currentMembership || ![MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN].includes(currentMembership.rol)) {
            throw new ServerError('No tienes permiso para eliminar miembros', 403);
        }

        // Marcar como inactivo
        await workspaceMemberRepository.updateById(member_id, { active: false });
    }
}

export default new WorkspaceMemberService();
