import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMessageRepository from '../repositories/channelMessage.repository.js';

class MessageService {
    async getMessagesByChannel(channel_id, page, limit) {
        return await channelMessageRepository.getByChannelIdWithPagination(channel_id, page, limit);
    }

    async createMessage(channel_member_id, channel_id, message_data) {
        const { content } = message_data;

        if (!content || content.trim().length === 0) {
            throw new ServerError('El contenido del mensaje no puede estar vacío', 400);
        }

        const modification_date = new Date(Date.now() + 15 * 60 * 1000);

        // Crear mensaje
        const message = await channelMessageRepository.create(
            channel_id,
            channel_member_id,
            content.trim(),
            modification_date
        );

        // Obtener el mensaje creado con referencias pobladas
        const createdMessage = await channelMessageRepository.findById(message._id);

        return {
            message_id: createdMessage._id,
            channel_id: createdMessage.fk_workspace_channel_id,
            member_name: createdMessage.fk_channel_member_id.fk_workspace_member_id.fk_user_id.user_name,
            content: createdMessage.content,
            updated_at: createdMessage.modification_date
        };
    }

    async updateMessage(message_id, modification_date, message_data) {
        const { content } = message_data;

        if (!content || content.trim().length === 0) {
            throw new ServerError('El contenido del mensaje no puede estar vacío', 400);
        }

        const now = new Date();
        const limit_date = new Date(modification_date);

        if (isNaN(limit_date.getTime()) || now > limit_date) {
            throw new ServerError('El tiempo permitido para modificar el mensaje ha expirado', 403);
        }

        // Actualizar mensaje
        const updated_message = await channelMessageRepository.updateById(message_id, {
            content: content.trim()
        });

        return {
            _id: updated_message._id,
            content: updated_message.content
        };
    }

    async deleteMessage(message_id, modification_date) {
        const now = new Date();
        const limit_date = new Date(modification_date);

        if (isNaN(limit_date.getTime()) || now > limit_date) {
            throw new ServerError('El tiempo permitido para modificar el mensaje ha expirado', 403);
        }

        await channelMessageRepository.hardDeleteById(message_id);
    }
}

export default new MessageService();
