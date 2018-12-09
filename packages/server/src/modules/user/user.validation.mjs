import { Validator } from '@be/core';

import { userValidationSchema } from './user.validation.schema';

const createUser = new Validator().body.schema(userValidationSchema.createUser);
const changePassword = new Validator().body.schema(userValidationSchema.changePassword);
const resetPassword = new Validator().body.schema(userValidationSchema.resetPassword);

const userValidation = {
  createUser,
  changePassword,
  resetPassword,
};

export {
  userValidation,
};
