import messageService from '../services/message.service.js';

const messageController = {
    async getMessages(req, res, next) {
        try {
            const { channel_id } = req.params;
            const { page, limit } = req.query;

            const parsedPage = page ? parseInt(page, 10) : 1;
            const parsedLimit = limit ? parseInt(limit, 10) : 10;

            const result = await messageService.getMessagesByChannel(channel_id, parsedPage, parsedLimit);

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
            const channel_member_id = req.channel_membership.channel_member_id;
            const result = await messageService.createMessage(channel_member_id, channel_id, req.body);

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
            const modification_date = req.message.modification_date;
            const result = await messageService.updateMessage(message_id, modification_date, req.body);

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
            const modification_date = req.message.modification_date;
            await messageService.deleteMessage(message_id, modification_date);

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
