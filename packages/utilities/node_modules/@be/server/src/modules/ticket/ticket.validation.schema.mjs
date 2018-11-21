import Joi from 'joi';

const ticketValidationSchema = {
  create: {
    routeId: Joi.string().required(),
    startDate: Joi.number().required(),
  },
};

export {
  ticketValidationSchema,
};
