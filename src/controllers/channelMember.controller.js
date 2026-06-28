import channelMemberService from '../services/channelMember.service.js';

const channelMemberController = {
    async addMember(req, res, next) {
        try {
            const { channel_id } = req.params;
            const result = await channelMemberService.addMember(channel_id, req.body);

            return res.status(201).json({
                ok: true,
                message: 'Miembro agregado al canal',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async removeMember(req, res, next) {
        try {
            const { channel_id, member_id } = req.params;
            await channelMemberService.removeMember(channel_id, member_id);

            return res.status(200).json({
                ok: true,
                message: 'Miembro eliminado del canal',
                data: null
            });
        } catch (error) {
            next(error);
        }
    },

    async getChannelMembers(req, res, next) {
        try {
            const { channel_id } = req.params;
            const result = await channelMemberService.getChannelMembers(channel_id);

            return res.status(200).json({
                ok: true,
                message: 'Miembros del canal',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};

export default channelMemberController;
