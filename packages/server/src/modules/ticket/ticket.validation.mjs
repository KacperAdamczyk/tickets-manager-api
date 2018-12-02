import { Validator } from '@be/core';

import { ticketValidationSchema } from './ticket.validation.schema';

const create = new Validator().body.schema(ticketValidationSchema.create);

const startMoment = new Validator()
  .project((req, res) => {
    const { startDate } = req.body;
    const { route: { startTime } } = res.locals;

    return {
      now: Date.now(),
      startMoment: startDate + startTime.valueOf(),
    };
  }).schema(ticketValidationSchema.startMoment);

const ticketValidation = {
  create,
  startMoment,
};

export {
  ticketValidation,
};
