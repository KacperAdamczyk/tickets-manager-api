import Joi from 'joi';

import { IATA_REGEX } from '../../config/regex';

const routeValidationSchema = {
  get: {
    source: Joi.string().regex(IATA_REGEX).required(),
    destination: Joi.string().regex(IATA_REGEX).required(),
  },
};

export {
  routeValidationSchema,
};
