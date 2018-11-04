import { Validator } from '@be/core';

import { airportValidationSchema } from './airport.validation.schema';

const getFiltered = new Validator().params.query.schema(airportValidationSchema.getFiltered);

const airportValidation = {
  getFiltered,
};

export {
  airportValidation,
};
