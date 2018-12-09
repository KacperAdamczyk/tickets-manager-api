import Joi from 'joi';

const passwordSchema = Joi.string().required();

const userValidationSchema = {
  createUser: {
    email: Joi.string().email().required(),
    password: passwordSchema,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  },

  changePassword: {
    oldPassword: passwordSchema,
    password: passwordSchema,
  },

  resetPassword: {
    password: passwordSchema,
  },
};

export {
  userValidationSchema,
};
