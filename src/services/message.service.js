import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMessageRepository from '../repositories/channelMessage.repository.js';

class MessageService {
    async getMessagesByChannel(channelId) {
        const messages = await channelMessageRepository.getByChannelId(channelId);

        return messages.map(msg => ({
            _id: msg.message_id,
            content: msg.content,
            fk_user_id: msg.member_name,
            updated_at: msg.updated_at
        }));
    }

    async createMessage(userId, channelId, messageData) {
        const { content } = messageData;

        if (!content || content.trim().length === 0) {
            throw new ServerError('El contenido del mensaje no puede estar vacío', 400);
        }

        // El canal y la pertenencia ya fueron validados por el middleware
        // Crear mensaje
        const message = await channelMessageRepository.create(
            channelId,
            userId,
            content.trim(),
            new Date()
        );

        return {
            _id: message._id,
            content: message.content,
            fk_user_id: userId
        };
    }

    async updateMessage(userId, messageId, messageData) {
        const { content } = messageData;

        if (!content || content.trim().length === 0) {
            throw new ServerError('El contenido del mensaje no puede estar vacío', 400);
        }

        // El mensaje ya fue cargado por el middleware (attachMessageMiddleware)
        // Verificamos la ventana de 15 minutos en el middleware o aquí

        // Actualizar mensaje
        const updatedMessage = await channelMessageRepository.updateById(messageId, {
            message: content.trim(),
            modification_date: new Date()
        });

        return {
            _id: updatedMessage._id,
            content: updatedMessage.message
        };
    }

    async deleteMessage(userId, messageId) {
        // El mensaje ya fue cargado por el middleware
        // Eliminar mensaje
        await channelMessageRepository.hardDeleteById(messageId);
    }
}

export default new MessageService();
