import { Validator } from '@be/core';

import { userValidationSchema } from './user.validation.schema';

const createUser = new Validator().body.schema(userValidationSchema.createUser);
const changePassword = new Validator().body.schema(userValidationSchema.changePassword);

const userValidation = {
  createUser,
  changePassword,
};

export {
  userValidation,
};
