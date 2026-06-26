import express from 'express';
import authController from '../controllers/auth.controller.js';
import validateEmailQueryMiddleware from '../middlewares/validateEmailQuery.middleware.js';
import validateBodyMiddleware from '../middlewares/validateBody.middleware.js';
import validateQueryMiddleware from '../middlewares/validateQuery.middleware.js';
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    verify2FASchema,
    forgotPasswordSchema,
    resetPasswordQuerySchema,
    resetPasswordBodySchema
} from '../utils/schemas/auth.schema.js';

const auth_router = express.Router();

auth_router.get('/check-email', validateEmailQueryMiddleware, authController.checkEmail);


auth_router.post('/register', validateBodyMiddleware(registerSchema), authController.register);


auth_router.patch('/verify-email', validateQueryMiddleware(verifyEmailSchema), authController.verifyEmail);


auth_router.post('/login', validateBodyMiddleware(loginSchema), authController.login);


auth_router.post('/verify-2fa', validateBodyMiddleware(verify2FASchema), authController.verify2FA);


auth_router.post('/forgot-password', validateBodyMiddleware(forgotPasswordSchema), authController.forgotPassword);


auth_router.post('/reset-password', validateQueryMiddleware(resetPasswordQuerySchema), validateBodyMiddleware(resetPasswordBodySchema), authController.resetPassword);

export default auth_router;