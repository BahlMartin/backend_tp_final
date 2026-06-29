import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMessageRepository from '../repositories/channelMessage.repository.js';

class MessageService {
    async getMessagesByChannel(channel_id) {
        const messages = await channelMessageRepository.getByChannelId(channel_id);

        return messages.map(message => ({
            message_id: message._id,
            message: message.message,
            fk_user_id: message.member_name,
            modification_date: message.modification_date
        }));
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

        return {
            _id: message._id,
            content: message.content,
            fk_channel_member_id: channel_member_id
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
