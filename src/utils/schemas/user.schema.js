import { validators } from '../validators/validators.js';

export const userUpdateSchema = {
    email: { required: false, validate: validators.email },
    first_name: { required: false, validate: validators.firstName },
    last_name: { required: false, validate: validators.lastName },
    user_name: { required: false, validate: validators.userName }
};
