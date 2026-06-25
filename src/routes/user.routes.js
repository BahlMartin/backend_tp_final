import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import { validators } from '../utils/validators/validators.js'

const user_router = express.Router();

const userUpdateSchema = {
    email: { required: false, validate: validators.email },
    first_name: { required: false, validate: validators.firstName },
    last_name: { required: false, validate: validators.lastName },
    user_name: { required: false, validate: validators.userName }
};

// GET /api/users/me
user_router.get('/me', authMiddleware, userController.getMe);

// PUT /api/users/me
user_router.put(
    '/me',
    authMiddleware,
    validateBodyMiddleware(userUpdateSchema),
    userController.updateMe
);

export default user_router;
