import Joi from 'joi';

import { IATA_REGEX } from '../../config/regex';

const airportValidationSchema = {
  getFiltered: {
    query: Joi.string().regex(/^[a-zA-Z ]+$/).required(),
    limit: Joi.number(),
    exclude: Joi.string().regex(IATA_REGEX),
  },
};

export {
  airportValidationSchema,
};
