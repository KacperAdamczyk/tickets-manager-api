import Joi from 'joi';

const userValidationSchema = {
  createUser: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  },
};

export {
  userValidationSchema,
};
