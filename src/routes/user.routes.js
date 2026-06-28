import express from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import { userUpdateSchema } from '../utils/schemas/user.schema.js';

const user_router = express.Router();

user_router.get('/me', authMiddleware, userController.getMe);

user_router.put(
    '/me',
    authMiddleware,
    validateBodyMiddleware(userUpdateSchema),
    userController.updateMe
);

export default user_router;
