import Joi from 'joi';

const ticketValidationSchema = {
  create: {
    routeId: Joi.string().required(),
    startDate: Joi.number().required(),
  },

  startMoment: {
    now: Joi.number().required(),
    startMoment: Joi.number().greater(Joi.ref('now')).required(),
  },
};

export {
  ticketValidationSchema,
};
