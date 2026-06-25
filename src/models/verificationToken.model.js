import mongoose from "mongoose";
import { USER_COLLECTION_NAME } from "./user.model.js";
import TOKEN_TYPES from "../utils/constants/tokenTypes.constants.js"

const verificationTokenSchema = new mongoose.Schema({
    fk_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    type_token: {
        type: String,
        enum: Object.values(TOKEN_TYPES),
        required: true
    },
    expiration_date: {
        type: Date,
        required: true,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

export const VERIFICATION_TOKEN_COLLECTION_NAME = 'verificationToken';
const VerificationToken = mongoose.model(VERIFICATION_TOKEN_COLLECTION_NAME, verificationTokenSchema);

export default VerificationToken;