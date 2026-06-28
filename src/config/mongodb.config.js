import mongoose from 'mongoose';
import ENVIROMENT from './enviroment.config.js';

const connectMongoDB = async () => {
    try {
        await mongoose.connect(ENVIROMENT.MONGO_DB_CONNECTION_STRING + '/' + ENVIROMENT.MONGO_DB_NAME);

        if (ENVIROMENT.MODE === 'development') {
            console.log('Conectado a MongoDB');
        }
    } catch (error) {
        if (ENVIROMENT.MODE === 'development') {
            console.error('Error al conectar a MongoDB:', error);
        }
    }
}

export default connectMongoDB;