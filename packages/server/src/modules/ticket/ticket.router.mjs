import express from 'express';
import { isAuthenticated, isAdmin } from '@be/core';

import { ticketController } from './ticket.controller';
import { ticketPopulate } from './ticket.populate';
import { ticketValidation } from './ticket.validation';

const router = express.Router();

router.param('id', ticketPopulate.populate);

router.get(
  '/:id',
  isAuthenticated,
  ticketController.getSuccess,
);

router.get(
  '/',
  isAuthenticated,
  ticketPopulate.populateAll,
  ticketController.getAllSuccess,
);

router.get(
  '/user/:user',
  isAuthenticated,
  isAdmin,
  ticketPopulate.populateAll,
  ticketController.getAllSuccess,
);

router.post(
  '/',
  isAuthenticated,
  ticketValidation.create,
  ticketPopulate.populateRoute,
  ticketValidation.startMoment,
  ticketController.create,
  ticketController.createSuccess,
);

router.delete(
  '/:id',
  isAuthenticated,
  ticketController.delete,
  ticketController.deleteSuccess,
);

export {
  router as ticketRouter,
};
