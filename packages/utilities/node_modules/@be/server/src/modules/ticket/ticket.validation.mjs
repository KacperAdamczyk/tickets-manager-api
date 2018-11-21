import { Validator } from '@be/core';

import { ticketValidationSchema } from './ticket.validation.schema';

const create = new Validator().body.schema(ticketValidationSchema.create);

const ticketValidation = {
  create,
};

export {
  ticketValidation,
};
