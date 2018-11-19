import { Validator } from '@be/core';

import { routeValidationSchema } from './route.validation.schema';

const get = new Validator().params.schema(routeValidationSchema.get);

const routeValidation = {
  get,
};

export {
  routeValidation,
};
