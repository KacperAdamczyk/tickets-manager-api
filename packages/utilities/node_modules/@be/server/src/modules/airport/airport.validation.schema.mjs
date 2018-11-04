import Joi from 'joi';

const airportValidationSchema = {
  getFiltered: {
    query: Joi.string().required(),
    limit: Joi.number(),
  },
};

export {
  airportValidationSchema,
};
