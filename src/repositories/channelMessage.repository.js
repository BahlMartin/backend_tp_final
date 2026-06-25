import mongoose from "mongoose";
import ChannelMessage from "../models/channelMessage.model.js";

class ChannelMessageRepository {

    async create(workspace_channel_id, workspace_member_id, message, modifcation_date) {
        return await ChannelMessage.create({
            fk_workspace_channel_id: workspace_channel_id,
            fk_workspace_member_id: workspace_member_id,
            message,
            modifcation_date
        });
    }

    async getByChannelId(workspace_channel_id) {
        return await ChannelMessage.find({ fk_workspace_channel_id: workspace_channel_id })
            .populate({
                path: 'fk_workspace_member_id',
                select: 'rol fk_user_id',
                populate: {
                    path: 'fk_user_id',
                    select: 'user_name email'
                }
            })
            .sort({ creation_date: -1 });
    }

    async getByChannelIdWithPagination(workspace_channel_id, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const messages = await ChannelMessage.find({ fk_workspace_channel_id: workspace_channel_id })
            .populate({
                path: 'fk_workspace_member_id',
                select: 'rol fk_user_id',
                populate: {
                    path: 'fk_user_id',
                    select: 'user_name email'
                }
            })
            .sort({ creation_date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ChannelMessage.countDocuments({ fk_workspace_channel_id: workspace_channel_id });

        return {
            messages: messages.map((message) => ({
                message_id: message._id,
                channel_id: message.fk_workspace_channel_id,
                member_name: message.fk_workspace_member_id?.fk_user_id?.user_name,
                content: message.message,
                updated_at: message.modification_date
            })),
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalMessages: total,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        };
    }

    async updateById(message_id, update) {
        return await ChannelMessage.findByIdAndUpdate(message_id, update);
    }

    async hardDeleteById(message_id) {
        return await ChannelMessage.findByIdAndDelete(message_id);
    }
}

export const channelMessageRepository = new ChannelMessageRepository();

export default channelMessageRepository;