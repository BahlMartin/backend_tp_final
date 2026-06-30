import ENVIROMENT from "../config/enviroment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../utils/helpers/serverError.helpers.js";
import INVITATION_STATES from "../utils/constants/invitationWorkspaceStates.constants.js";

class MailService {

    async sendVerificationEmail(userEmail, verificationToken) {
        try {
            const verificationUrl = `${ENVIROMENT.URL_FRONTEND}/verify-email?token=${verificationToken}`;

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
                                background-color: #f4ede8;
                                margin: 0;
                                padding: 0;
                                color: #1d1c1d;
                            }
                            .wrapper {
                                background-color: #f4ede8;
                                padding: 40px 20px;
                            }
                            .container {
                                max-width: 560px;
                                margin: 0 auto;
                                background: #ffffff;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                            }
                            .header {
                                background-color: #4a154b;
                                padding: 32px 30px 28px;
                                text-align: center;
                            }
                            .header-logo {
                                font-size: 12px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                opacity: 0.7;
                                margin-bottom: 14px;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 900;
                                color: #ffffff;
                                line-height: 1.3;
                            }
                            .content {
                                padding: 36px 40px 28px;
                                line-height: 1.65;
                                color: #1d1c1d;
                            }
                            .content p {
                                margin: 0 0 14px;
                                font-size: 16px;
                            }
                            .button {
                                display: inline-block;
                                padding: 14px 32px;
                                text-decoration: none;
                                border-radius: 4px;
                                font-weight: 700;
                                margin: 20px 0;
                                font-size: 15px;
                                background-color: #007a5a;
                                color: #ffffff;
                                text-align: center;
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            }
                            .footer {
                                background-color: #f4ede8;
                                padding: 22px 40px;
                                text-align: center;
                                font-size: 12px;
                                color: #868686;
                                border-top: 1px solid #ece8df;
                            }
                            .footer p { margin: 4px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">
                                <div class="header">
                                    <div class="header-logo">UTN Backend</div>
                                    <h1>✉️ Verifica tu dirección de correo</h1>
                                </div>
                                <div class="content">
                                    <p style="font-size: 16px; margin-top: 0;">¡Bienvenido!</p>
                                    <p>Para completar tu registro, necesitas verificar tu dirección de correo electrónico.</p>
                                    <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
                                    <div style="text-align:center;">
                                        <a href="${verificationUrl}" class="button">Verificar Email</a>
                                    </div>
                                    <p style="font-size: 13px; color: #868686; margin-top: 24px; text-align: center;">Este enlace de verificación expirará en 15 minutos.</p>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                                </div>
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
                                background-color: #f4ede8;
                                margin: 0;
                                padding: 0;
                                color: #1d1c1d;
                            }
                            .wrapper {
                                background-color: #f4ede8;
                                padding: 40px 20px;
                            }
                            .container {
                                max-width: 560px;
                                margin: 0 auto;
                                background: #ffffff;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                            }
                            .header {
                                background-color: #4a154b;
                                padding: 32px 30px 28px;
                                text-align: center;
                            }
                            .header-logo {
                                font-size: 12px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                opacity: 0.7;
                                margin-bottom: 14px;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 900;
                                color: #ffffff;
                                line-height: 1.3;
                            }
                            .content {
                                padding: 36px 40px 28px;
                                line-height: 1.65;
                                color: #1d1c1d;
                            }
                            .content p {
                                margin: 0 0 14px;
                                font-size: 16px;
                            }
                            .code-box {
                                background: #f8f5ff;
                                border: 1px solid #e8dff5;
                                border-left: 4px solid #4a154b;
                                padding: 20px;
                                border-radius: 6px;
                                text-align: center;
                                margin: 25px 0;
                            }
                            .code {
                                font-size: 32px;
                                font-weight: 800;
                                color: #4a154b;
                                letter-spacing: 4px;
                                font-family: 'Courier New', monospace;
                            }
                            .footer {
                                background-color: #f4ede8;
                                padding: 22px 40px;
                                text-align: center;
                                font-size: 12px;
                                color: #868686;
                                border-top: 1px solid #ece8df;
                            }
                            .footer p { margin: 4px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">
                                <div class="header">
                                    <div class="header-logo">UTN Backend</div>
                                    <h1>🔑 Código de Autenticación</h1>
                                </div>
                                <div class="content">
                                    <p style="font-size: 16px; margin-top: 0;">¡Hola!</p>
                                    <p>Tu código de verificación de dos factores (2FA) es:</p>
                                    <div class="code-box">
                                        <div class="code">${code2FA}</div>
                                    </div>
                                    <p>Ingresa este código en la aplicación para completar tu acceso de inicio de sesión.</p>
                                    <p style="font-size: 13px; color: #868686; margin-top: 24px; text-align: center;">Este código expirará en 15 minutos.</p>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                                </div>
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
            const resetUrl = `${ENVIROMENT.URL_FRONTEND}/reset-password?token=${resetToken}`;

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
                                background-color: #f4ede8;
                                margin: 0;
                                padding: 0;
                                color: #1d1c1d;
                            }
                            .wrapper {
                                background-color: #f4ede8;
                                padding: 40px 20px;
                            }
                            .container {
                                max-width: 560px;
                                margin: 0 auto;
                                background: #ffffff;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                            }
                            .header {
                                background-color: #4a154b;
                                padding: 32px 30px 28px;
                                text-align: center;
                            }
                            .header-logo {
                                font-size: 12px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                opacity: 0.7;
                                margin-bottom: 14px;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 900;
                                color: #ffffff;
                                line-height: 1.3;
                            }
                            .content {
                                padding: 36px 40px 28px;
                                line-height: 1.65;
                                color: #1d1c1d;
                            }
                            .content p {
                                margin: 0 0 14px;
                                font-size: 16px;
                            }
                            .button {
                                display: inline-block;
                                padding: 14px 32px;
                                text-decoration: none;
                                border-radius: 4px;
                                font-weight: 700;
                                margin: 20px 0;
                                font-size: 15px;
                                background-color: #007a5a;
                                color: #ffffff;
                                text-align: center;
                                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            }
                            .footer {
                                background-color: #f4ede8;
                                padding: 22px 40px;
                                text-align: center;
                                font-size: 12px;
                                color: #868686;
                                border-top: 1px solid #ece8df;
                            }
                            .footer p { margin: 4px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">
                                <div class="header">
                                    <div class="header-logo">UTN Backend</div>
                                    <h1>🔒 Recuperar Contraseña</h1>
                                </div>
                                <div class="content">
                                    <p style="font-size: 16px; margin-top: 0;">¡Hola!</p>
                                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                                    <p>Haz clic en el botón de abajo para establecer una nueva contraseña:</p>
                                    <div style="text-align:center;">
                                        <a href="${resetUrl}" class="button">Recuperar Contraseña</a>
                                    </div>
                                    <p style="font-size: 13px; color: #868686; margin-top: 24px; text-align: center;">Este enlace de recuperación expirará en 5 minutos.</p>
                                </div>
                                <div class="footer">
                                    <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                                </div>
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

    async sendInvitationEmail(userEmail, invitationId, inviterName, workspaceName) {
        try {
            const accept_url = `${ENVIROMENT.URL_FRONTEND}/invitations/${invitationId}/${INVITATION_STATES.ACCEPTED}`;
            const reject_url = `${ENVIROMENT.URL_FRONTEND}/invitations/${invitationId}/${INVITATION_STATES.REJECTED}`;

            await mailer_transport.sendMail({
                from: `"UTN Backend" <${ENVIROMENT.GMAIL_USERNAME}>`,
                to: userEmail,
                subject: `${inviterName} te invitó a unirte a ${workspaceName} - UTN Backend`,
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
                                background-color: #f4ede8;
                                margin: 0;
                                padding: 0;
                                color: #1d1c1d;
                            }
                            .wrapper {
                                background-color: #f4ede8;
                                padding: 40px 20px;
                            }
                            .container {
                                max-width: 560px;
                                margin: 0 auto;
                                background: #ffffff;
                                border-radius: 8px;
                                overflow: hidden;
                                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                            }
                            .header {
                                background-color: #4a154b;
                                padding: 32px 30px 28px;
                                text-align: center;
                            }
                            .header-logo {
                                font-size: 12px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: 2px;
                                text-transform: uppercase;
                                opacity: 0.7;
                                margin-bottom: 14px;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 26px;
                                font-weight: 900;
                                color: #ffffff;
                                line-height: 1.3;
                            }
                            .content {
                                padding: 36px 40px 28px;
                                line-height: 1.65;
                                color: #1d1c1d;
                            }
                            .content p {
                                margin: 0 0 14px;
                                font-size: 16px;
                            }
                            .section-label {
                                font-size: 12px;
                                color: #868686;
                                text-transform: uppercase;
                                letter-spacing: 0.08em;
                                font-weight: 700;
                                margin: 0 0 6px;
                            }
                            .button {
                                display: inline-block;
                                padding: 14px 32px;
                                text-decoration: none;
                                border-radius: 4px;
                                font-weight: 700;
                                margin: 8px 6px;
                                font-size: 15px;
                            }
                            .button-accept {
                                background-color: #007a5a;
                                color: #ffffff;
                            }
                            .button-reject {
                                background-color: #ffffff;
                                color: #616061;
                                border: 1px solid #dddddd;
                            }
                            .footer {
                                background-color: #f4ede8;
                                padding: 22px 40px;
                                text-align: center;
                                font-size: 12px;
                                color: #868686;
                                border-top: 1px solid #ece8df;
                            }
                            .footer p { margin: 4px 0; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">

                                <div class="header">
                                    <div class="header-logo">UTN Backend</div>
                                    <h1>🎉 Tienes una nueva invitación</h1>
                                </div>

                                <div class="content">
                                    <p>¡Hola! Recibiste una invitación para unirte a un espacio de trabajo en <strong>UTN Backend</strong>.</p>

                                    <!-- Quién invita -->
                                    <p class="section-label">Fuiste invitado por</p>
                                    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; background-color:#f8f5ff; border:1px solid #e8dff5; border-left:4px solid #4a154b; border-radius:6px; margin-bottom:24px;">
                                        <tr>
                                            <td style="padding:16px 20px;">
                                                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                                    <tr>
                                                        <td style="vertical-align:middle; padding-right:14px;">
                                                            <div style="width:42px; height:42px; background-color:#4a154b; border-radius:6px; text-align:center; line-height:42px; font-size:18px; font-weight:700; color:#ffffff;">👤</div>
                                                        </td>
                                                        <td style="vertical-align:middle;">
                                                            <strong style="display:block; font-size:16px; color:#1d1c1d; font-weight:800;">${inviterName}</strong>
                                                            <span style="font-size:13px; color:#616061;">te ha enviado una invitación</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Workspace destino -->
                                    <p class="section-label">Para unirte al espacio de trabajo</p>
                                    <div style="background-color:#f8f5ff; border:1px solid #e8dff5; border-radius:8px; padding:22px 24px; margin-bottom:28px; text-align:center;">
                                        <div style="font-size:34px; margin-bottom:10px;">🏢</div>
                                        <div style="font-size:22px; font-weight:900; color:#4a154b;">${workspaceName}</div>
                                    </div>

                                    <!-- Botones -->
                                    <div style="text-align:center; margin-bottom:20px;">
                                        <a href="${accept_url}" class="button button-accept">✅ Unirme al workspace</a>
                                        <a href="${reject_url}" class="button button-reject">No, gracias</a>
                                    </div>

                                    <p style="font-size:13px; color:#868686; text-align:center; margin:0;">⏳ Esta invitación expira en <strong>7 días</strong>.</p>

                                    <hr style="border:none; border-top:1px solid #eeeeee; margin:24px 0;">
                                    <p style="font-size:13px; color:#868686; margin:0;">Si no esperabas esta invitación o no reconocés a <strong>${inviterName}</strong>, podés ignorar este email con total seguridad.</p>
                                </div>

                                <div class="footer">
                                    <p>&copy; 2026 UTN Backend. Todos los derechos reservados.</p>
                                    <p style="margin-top:6px;">Este email fue enviado a ${userEmail}</p>
                                </div>

                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
            return { status: 200, message: "Email de invitación enviado" };
        } catch (error) {
            console.error('Error al enviar email de invitación:', error);
            throw new ServerError("Error al enviar email de invitación al workspace", 500);
        }
    }

}

const mailService = new MailService()
export default mailService