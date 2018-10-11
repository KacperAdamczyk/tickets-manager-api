import { Validator } from 'core';

import { userValidationSchema } from './user.validation.schema';

const createUser = new Validator().body.schema(userValidationSchema.createUser);

const userValidation = {
    createUser,
};

export {
    userValidation,
};
