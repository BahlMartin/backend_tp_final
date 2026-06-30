import ChannelMember from '../models/channelMember.model.js';

class ChannelMemberRepository {
    async create(workspace_channel_id, workspace_member_id) {
        return await ChannelMember.create({
            fk_workspace_channel_id: workspace_channel_id,
            fk_workspace_member_id: workspace_member_id
        });
    }

    async hardDeleteById(channel_member_id) {
        return await ChannelMember.findByIdAndDelete(channel_member_id);
    }

    async getMembersByChannelId(workspace_channel_id) {
        const result = await ChannelMember.find({ fk_workspace_channel_id: workspace_channel_id })
            .populate({
                path: 'fk_workspace_member_id',
                select: ' fk_user_id',
                populate: {
                    path: 'fk_user_id',
                    select: 'user_name email'
                }
            });

        const activeMembers = result.filter(member => member.fk_workspace_member_id);
        return activeMembers.map((member) => ({
            channel_member_id: member._id,
            workspace_member_id: member.fk_workspace_member_id._id,
            member_email: member.fk_workspace_member_id.fk_user_id?.email,
            member_name: member.fk_workspace_member_id.fk_user_id?.user_name,
        }));
    }

    async getChannelsByWorkspaceMemberId(workspace_member_id) {
        return await ChannelMember.find({ fk_workspace_member_id: workspace_member_id });
    }

    async getByChannelAndWorkspaceMemberId(channel_id, workspace_member_id) {
        return await ChannelMember.findOne({ fk_workspace_channel_id: channel_id, fk_workspace_member_id: workspace_member_id });
    }

    async getByChannelAndChannelMemberId(channel_id, channel_member_id) {
        return await ChannelMember.findOne({ fk_workspace_channel_id: channel_id, _id: channel_member_id });
    }

    async deleteByWorkspaceMemberId(workspace_member_id) {
        return await ChannelMember.deleteMany({ fk_workspace_member_id: workspace_member_id });
    }
}

export const channelMemberRepository = new ChannelMemberRepository();

export default channelMemberRepository;
