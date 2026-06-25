import channelMemberService from '../services/channelMember.service.js';

const channelMemberController = {
    async addMember(req, res, next) {
        try {
            const { channel_id } = req.params;
            const userId = req.user.userId;
            const result = await channelMemberService.addMember(userId, channel_id, req.body);

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
            const userId = req.user.userId;
            await channelMemberService.removeMember(userId, channel_id, member_id);

            return res.status(200).json({
                ok: true,
                message: 'Miembro eliminado del canal',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};

export default channelMemberController;
