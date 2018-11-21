import express from 'express';
import { isAuthenticated } from '@be/core';

import { ticketController } from './ticket.controller';
import { ticketPopulate } from './ticket.populate';
import { ticketValidation } from './ticket.validation';

const router = express.Router();

router.get(
  '/:id',
  isAuthenticated,
  ticketPopulate.populateForUser,
  ticketController.getSuccess,
);

router.get(
  '/',
  isAuthenticated,
  ticketPopulate.populateAllForUser,
  ticketController.getAllSuccess,
);

router.post(
  '/',
  isAuthenticated,
  ticketValidation.create,
  ticketPopulate.populateRoute,
  ticketController.create,
  ticketController.createSuccess,
);

export {
  router as ticketRouter,
};
