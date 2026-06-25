import ENVIROMENT from "../config/enviroment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../utils/helpers/serverError.helpers.js";

class MailService {

    async sendVerificationEmail(userEmail, verificationToken) {
        try {
            const verificationUrl = `${ENVIROMENT.FRONTEND_URL}/verify-email?token=${verificationToken}`;

            await mailer_transport.sendMail({
                from: `"UTN Backend" <${ENVIROMENT.GMAIL_USERNAME}>`,
                to: userEmail,
                subject: 'Verifica tu email - UTN Backend',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verificar Email</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
                                background-color: #0f172a;
                                margin: 0;
                                padding: 0;
                                color: #f1f5f9;
                            }
                            .container {
                                max-width: 580px;
                                margin: 40px auto;
                                background: #1e293b;
                                border-radius: 12px;
                                overflow: hidden;
                                border: 1px solid #334155;
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                            }
                            .header {
                                background: linear-gradient(135deg, #6366f1, #3b82f6);
                                color: #ffffff;
                                padding: 40px 30px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 700;
                            }
                            .content {
                                padding: 40px 35px;
                                line-height: 1.7;
                            }
                            .button {
                                display: inline-block;
                                padding: 12px 28px;
                                background: linear-gradient(135deg, #10b981, #059669);
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: 600;
                                margin: 20px 0;
                                font-size: 15px;
                            }
                            .footer {
                                background-color: #0f172a;
                                padding: 25px;
                                text-align: center;
                                font-size: 12px;
                                color: #64748b;
                                border-top: 1px solid #334155;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Verifica tu Email</h1>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px;">¡Bienvenido!</p>
                                <p style="font-size: 15px;">Para completar tu registro, necesitas verificar tu dirección de email.</p>
                                <p style="font-size: 15px;">Haz clic en el botón de abajo para verificar tu email:</p>
                                <center>
                                    <a href="${verificationUrl}" class="button">Verificar Email</a>
                                </center>
                                <p style="font-size: 13px; color: #94a3b8;">Este enlace expirará en 15 minutos.</p>
                                <p style="font-size: 13px; color: #94a3b8;">Si no solicitaste este email, ignóralo.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
            return { status: 200, message: "Email de verificación enviado" }
        } catch (error) {
            console.error('Error al enviar email de verificación:', error);
            throw new ServerError("Error al enviar email de verificación", 500);
        }
    }

    async send2FAEmail(userEmail, code2FA) {
        try {
            await mailer_transport.sendMail({
                from: `"UTN Backend" <${ENVIROMENT.GMAIL_USERNAME}>`,
                to: userEmail,
                subject: 'Tu código de verificación - UTN Backend',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Código de Verificación</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
                                background-color: #0f172a;
                                margin: 0;
                                padding: 0;
                                color: #f1f5f9;
                            }
                            .container {
                                max-width: 580px;
                                margin: 40px auto;
                                background: #1e293b;
                                border-radius: 12px;
                                overflow: hidden;
                                border: 1px solid #334155;
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                            }
                            .header {
                                background: linear-gradient(135deg, #f59e0b, #f97316);
                                color: #ffffff;
                                padding: 40px 30px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 700;
                            }
                            .content {
                                padding: 40px 35px;
                                line-height: 1.7;
                            }
                            .code-box {
                                background: #0f172a;
                                border: 2px solid #f59e0b;
                                padding: 20px;
                                border-radius: 8px;
                                text-align: center;
                                margin: 25px 0;
                            }
                            .code {
                                font-size: 32px;
                                font-weight: 700;
                                color: #f59e0b;
                                letter-spacing: 4px;
                                font-family: 'Courier New', monospace;
                            }
                            .footer {
                                background-color: #0f172a;
                                padding: 25px;
                                text-align: center;
                                font-size: 12px;
                                color: #64748b;
                                border-top: 1px solid #334155;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Código de Autenticación</h1>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px;">¡Hola!</p>
                                <p style="font-size: 15px;">Tu código de verificación de dos factores es:</p>
                                <div class="code-box">
                                    <div class="code">${code2FA}</div>
                                </div>
                                <p style="font-size: 15px;">Ingresa este código en la aplicación para completar tu acceso.</p>
                                <p style="font-size: 13px; color: #94a3b8;">Este código expirará en 15 minutos.</p>
                                <p style="font-size: 13px; color: #94a3b8;">Si no solicitaste este código, por favor cambia tu contraseña inmediatamente.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
            return { status: 200, message: "Código 2FA enviado" }
        } catch (error) {
            console.error('Error al enviar código 2FA:', error);
            throw new ServerError("Error al enviar código de verificación", 500);
        }
    }

    async sendPasswordResetEmail(userEmail, resetToken) {
        try {
            const resetUrl = `${ENVIROMENT.FRONTEND_URL}/reset-password?token=${resetToken}`;

            await mailer_transport.sendMail({
                from: `"UTN Backend" <${ENVIROMENT.GMAIL_USERNAME}>`,
                to: userEmail,
                subject: 'Recupera tu contraseña - UTN Backend',
                html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Recuperar Contraseña</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
                                background-color: #0f172a;
                                margin: 0;
                                padding: 0;
                                color: #f1f5f9;
                            }
                            .container {
                                max-width: 580px;
                                margin: 40px auto;
                                background: #1e293b;
                                border-radius: 12px;
                                overflow: hidden;
                                border: 1px solid #334155;
                                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                            }
                            .header {
                                background: linear-gradient(135deg, #ef4444, #dc2626);
                                color: #ffffff;
                                padding: 40px 30px;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 700;
                            }
                            .content {
                                padding: 40px 35px;
                                line-height: 1.7;
                            }
                            .button {
                                display: inline-block;
                                padding: 12px 28px;
                                background: linear-gradient(135deg, #10b981, #059669);
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: 600;
                                margin: 20px 0;
                                font-size: 15px;
                            }
                            .footer {
                                background-color: #0f172a;
                                padding: 25px;
                                text-align: center;
                                font-size: 12px;
                                color: #64748b;
                                border-top: 1px solid #334155;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Recuperar Contraseña</h1>
                            </div>
                            <div class="content">
                                <p style="font-size: 16px;">¡Hola!</p>
                                <p style="font-size: 15px;">Recibimos una solicitud para recuperar tu contraseña.</p>
                                <p style="font-size: 15px;">Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
                                <center>
                                    <a href="${resetUrl}" class="button">Recuperar Contraseña</a>
                                </center>
                                <p style="font-size: 13px; color: #94a3b8;">Este enlace expirará en 5 minutos.</p>
                                <p style="font-size: 13px; color: #94a3b8;">Si no solicitaste recuperar tu contraseña, ignora este email.</p>
                            </div>
                            <div class="footer">
                                <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
            return { status: 200, message: "Email de recuperación enviado" }
        } catch (error) {
            console.error('Error al enviar email de recuperación:', error);
            throw new ServerError("Error al enviar email de recuperación", 500);
        }
    }

    async sendInvitationMemberEmail(invited_mail, accept_url, reject_url, rol) {
        try {
            await mailer_transport.sendMail({
                from: `"UTN Backend" <${ENVIROMENT.GMAIL_USERNAME}>`,
                to: invited_mail,
                subject: `Invitación a colaborar en el espacio de trabajo `,
                html: `
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Invitación a Espacio de Trabajo</title>
                            <style>
                                body {
                                    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
                                    background-color: #0f172a;
                                    margin: 0;
                                    padding: 0;
                                    color: #f1f5f9;
                                }
                                .container {
                                    max-width: 580px;
                                    margin: 40px auto;
                                    background: #1e293b;
                                    border-radius: 12px;
                                    overflow: hidden;
                                    border: 1px solid #334155;
                                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                                }
                                .header {
                                    background: linear-gradient(135deg, #6366f1, #3b82f6);
                                    color: #ffffff;
                                    padding: 40px 30px;
                                    text-align: center;
                                }
                                .header h1 {
                                    margin: 0;
                                    font-size: 26px;
                                    font-weight: 700;
                                    letter-spacing: -0.025em;
                                }
                                .content {
                                    padding: 40px 35px;
                                    line-height: 1.7;
                                }
                                .workspace-card {
                                    background-color: #0f172a;
                                    border: 1px solid #334155;
                                    padding: 25px;
                                    margin: 25px 0;
                                    border-radius: 8px;
                                    text-align: center;
                                }
                                .workspace-name {
                                    font-weight: 700;
                                    font-size: 20px;
                                    color: #38bdf8;
                                    margin-bottom: 8px;
                                }
                                .workspace-desc {
                                    font-size: 14px;
                                    color: #94a3b8;
                                    margin-top: 0;
                                }
                                .button-group {
                                    text-align: center;
                                    margin-top: 35px;
                                }
                                .button {
                                    display: inline-block;
                                    padding: 12px 28px;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    font-weight: 600;
                                    margin: 10px 8px;
                                    font-size: 15px;
                                    text-align: center;
                                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                                }
                                .button-accept {
                                    background: linear-gradient(135deg, #10b981, #059669);
                                    color: #ffffff;
                                }
                                .button-reject {
                                    background-color: #334155;
                                    color: #e2e8f0;
                                    border: 1px solid #475569;
                                }
                                .footer {
                                    background-color: #0f172a;
                                    padding: 25px;
                                    text-align: center;
                                    font-size: 12px;
                                    color: #64748b;
                                    border-top: 1px solid #334155;
                                }
                                .footer p {
                                    margin: 0;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>Invitación Recibida</h1>
                                </div>
                                <div class="content">
                                    <p style="font-size: 16px; margin-top: 0;">¡Hola!</p>
                                    <p style="font-size: 16px;">Has sido invitado a formar parte del espacio de trabajo en nuestra plataforma.</p>
                                    <p style="font-size: 16px;">Con rol: ${rol}</p>

                                    
                                    <p style="font-size: 15px; text-align: center; color: #94a3b8;">¿Deseas aceptar esta invitación?</p>
                                    
                                    <div class="button-group">
                                        <a href="${accept_url}" class="button button-accept">Aceptar Invitación</a>
                                        <a href="${reject_url}" class="button button-reject">Rechazar</a>
                                    </div>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                                    <p style="margin-top: 8px;">Este enlace de invitación expirará en 24 horas.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        `
            });
            return { status: 200, message: "Invitacion enviada" }
        } catch (error) {
            throw new ServerError("Error interno del servidor mail", 500)
        }
    }

}

const mailService = new MailService()
export default mailService