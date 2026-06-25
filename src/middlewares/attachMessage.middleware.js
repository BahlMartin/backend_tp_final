import ServerError from '../utils/helpers/serverError.helpers.js';
import channelMessageRepository from '../repositories/channelMessage.repository.js';

async function attachMessageMiddleware(req, res, next) {
    try {
        const { message_id } = req.params;

        const message = await channelMessageRepository.findById(message_id);
        if (!message) {
            throw new ServerError('Mensaje no encontrado', 404);
        }

        req.message = message;

        next();
    } catch (error) {
        next(error);
    }
}

export default attachMessageMiddleware;
