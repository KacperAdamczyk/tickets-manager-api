import express from 'express';
import { isAuthenticated } from '@be/core';

import { airportController } from './airport.controller';
import { airportValidation } from './airport.validation';

const router = express.Router();

router.get(
  '/:query',
  isAuthenticated,
  airportValidation.getFiltered,
  airportController.getFiltered,
  airportController.getFilteredSuccess,
);

export {
  router as airportRouter,
};
