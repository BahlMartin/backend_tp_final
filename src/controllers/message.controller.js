import messageService from '../services/message.service.js';

const messageController = {
    async getMessages(req, res, next) {
        try {
            const { channel_id } = req.params;
            const result = await messageService.getMessagesByChannel(channel_id);

            return res.status(200).json({
                ok: true,
                message: 'Mensajes obtenidos',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async createMessage(req, res, next) {
        try {
            const { channel_id } = req.params;
            const userId = req.user.userId;
            const result = await messageService.createMessage(userId, channel_id, req.body);

            return res.status(201).json({
                ok: true,
                message: 'Mensaje creado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async updateMessage(req, res, next) {
        try {
            const { message_id } = req.params;
            const userId = req.user.userId;
            const result = await messageService.updateMessage(userId, message_id, req.body);

            return res.status(200).json({
                ok: true,
                message: 'Mensaje actualizado',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteMessage(req, res, next) {
        try {
            const { message_id } = req.params;
            const userId = req.user.userId;
            await messageService.deleteMessage(userId, message_id);

            return res.status(200).json({
                ok: true,
                message: 'Mensaje eliminado',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
};

export default messageController;
