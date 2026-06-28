import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMemberRepository from '../repositories/channelMember.repository.js';
import workspaceMemberRepository from '../repositories/workspaceMember.repository.js';

class ChannelMemberService {
    async addMember(channel_id, member_data) {
        const member_id_invited = member_data.member_id;

        // Verificar que el usuario pertenezca al workspace
        const workspace_member = await workspaceMemberRepository.getByMemberId(member_id_invited);
        if (!workspace_member) {
            throw new ServerError('El usuario no pertenece al workspace', 404);
        }

        const is_channel_member = await channelMemberRepository.getByChannelAndWorkspaceMemberId(channel_id, member_id_invited);
        if (is_channel_member) {
            throw new ServerError('El usuario ya es miembro del canal', 400);
        }

        const channel_member = await channelMemberRepository.create(channel_id, member_id_invited);

        return {
            _id: channel_member._id
        };
    }

    async getChannelMembers(channel_id) {
        const members = await channelMemberRepository.getMembersByChannelId(channel_id);
        if (!members) {
            throw new ServerError('No se encontraron miembros en el canal', 404);
        }
        const members_id = members.map((member) => ({
            channel_member_id: member.channel_member_id,
            member_name: member.member_name
        }));
        return members_id;
    }

    async removeMember(channel_id, member_id) {

        const is_channel_member = await channelMemberRepository.getByChannelAndChannelMemberId(channel_id, member_id);
        if (!is_channel_member) {
            throw new ServerError('El usuario no es miembro del canal', 404);
        }


        await channelMemberRepository.hardDeleteById(member_id);
    }


}

export default new ChannelMemberService();
