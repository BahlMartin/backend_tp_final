import ServerError from '../utils/helpers/serverError.helpers.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';
import MEMBER_WORKSPACE_ROLES from '../utils/constants/memberRoles.constants.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';

class WorkspaceMemberService {
    async getWorkspaceMembers(workspace_id) {
        const members = await workspaceMemberRepository.getMembersByWorkspaceId(workspace_id);
        return members;
    }

    async updateMemberRole(user_id, workspace_id, member_id, update_data, preloaded_membership = null) {
        const { rol } = update_data;

        if (!Object.values(MEMBER_WORKSPACE_ROLES).includes(rol)) {
            throw new ServerError('Rol inválido', 400);
        }

        if (rol === MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('No es posible cambiar el rol a owner', 403);
        }
        // Verificar que el usuario actual es owner
        const current_membership = preloaded_membership || await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);

        if (!current_membership || current_membership.rol !== MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('Solo el owner puede cambiar roles', 403);
        }

        //Verificar que el miembro a modificar sea miembro del workspace
        const membership_member = await workspaceMemberRepository.getByMemberId(member_id);

        if (!membership_member || membership_member.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('El usuario no es miembro del workspace', 403);
        }

        if (membership_member.rol === MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('No puedes cambiar el rol del owner', 403);
        }


        if (membership_member.rol === rol) {
            throw new ServerError('El usuario ya tiene ese rol', 403);
        }

        // Actualizar rol
        const updated_member = await workspaceMemberRepository.updateById(membership_member._id, { rol });

        return {
            _id: updated_member._id,
            rol: updated_member.rol
        };
    }

    async removeMember(user_id, workspace_id, member_id, preloaded_membership = null) {
        // Verificar que el usuario actual es owner o admin
        const current_membership = preloaded_membership || await workspaceMemberRepository.getByUserAndWorkspaceId(user_id, workspace_id);

        if (!current_membership || ![MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN].includes(current_membership.rol)) {
            throw new ServerError('No tienes permiso para eliminar miembros', 403);
        }

        // Obtener el miembro a eliminar
        const target_membership = await workspaceMemberRepository.getByMemberId(member_id);
        if (!target_membership || target_membership.fk_workspace_id.toString() !== workspace_id) {
            throw new ServerError('El miembro no pertenece a este workspace', 404);
        }

        // Impedir que un admin o cualquier persona desactive al OWNER
        if (target_membership.rol === MEMBER_WORKSPACE_ROLES.OWNER) {
            throw new ServerError('No se puede eliminar al propietario del workspace', 403);
        }

        // Marcar como inactivo
        await workspaceMemberRepository.updateById(member_id, { active: false });

        // Eliminar de todos los canales
        await channelMemberRepository.deleteByWorkspaceMemberId(member_id);
    }
}

export default new WorkspaceMemberService();
