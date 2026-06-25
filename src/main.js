import ENVIROMENT from './config/enviroment.config.js';
import connectMongoDB from './config/mongodb.config.js';
import express from 'express'
import dns from 'dns';
import cors from 'cors'
import errorHandlerMiddleware from './middlewares/error.middleware.js';
import auth_router from './routes/auth.routes.js';
import user_router from './routes/user.routes.js';
import workspace_router from './routes/workspace.route.js';
import invitation_router from './routes/invitation.routes.js';
import channel_router from './routes/channel.routes.js';

if (ENVIROMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
}

connectMongoDB();
const PORT = ENVIROMENT.PORT


//creamos la app
const app = express()
//como recibe json en el body 
app.use(express.json())
// habilitamos las consulta cross origin desde el frontend 
app.use(cors())

// Registrar rutas
app.use('/api/auth', auth_router);
app.listen(PORT, () => {
    console.log("nuestra aplicacion express se esta ejecutando en el puerto " + PORT)
})
app.use('/api/users', user_router);
app.use('/api/workspaces', workspace_router);
app.use('/api/invitations', invitation_router);
app.use('/api/channels', channel_router);

// Middleware global de manejo de errores (debe ser el último)
app.use(errorHandlerMiddleware)