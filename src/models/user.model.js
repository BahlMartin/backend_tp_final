import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    verification_email: {
        type: Boolean,
        default: false,
        required: false
    },
    active: {
        type: Boolean,
        default: true,
        required: true
    }
})

export const USER_COLLECTION_NAME = 'user';
const User = mongoose.model(USER_COLLECTION_NAME, userSchema);

export default User;