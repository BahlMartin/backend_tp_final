import channelService from '../services/channel.service.js';

const channelController = {
    async createChannel(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const user_id = req.user.user_id;
            const result = await channelService.createChannel(user_id, workspace_id, req.body);

            return res.status(201).json({
                ok: true,
                message: 'Canal creado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getChannels(req, res, next) {
        try {
            const { workspace_id } = req.params;
            const result = await channelService.getChannelsByWorkspace(workspace_id);

            return res.status(200).json({
                ok: true,
                message: 'Canales obtenidos',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async getChannelById(req, res, next) {
        try {
            const { channel_id } = req.params;
            const result = await channelService.getChannelById(channel_id);

            return res.status(200).json({
                ok: true,
                message: 'Canal obtenido',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteChannel(req, res, next) {
        try {
            const { workspace_id, channel_id } = req.params;
            const user_id = req.user.user_id;
            await channelService.deleteChannel(user_id, workspace_id, channel_id);

            return res.status(200).json({
                ok: true,
                message: 'Canal eliminado',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};

export default channelController;
