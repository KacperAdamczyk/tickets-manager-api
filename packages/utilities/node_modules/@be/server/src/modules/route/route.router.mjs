import express from 'express';
import { isAuthenticated } from '@be/core';

import { routeController } from './route.controller';
import { routePopulate } from './route.populate';
import { routeValidation } from './route.validation';

const router = express.Router();

router.param('source', routePopulate.sourceAirport);
router.param('destination', routePopulate.destinationAirport);

router.get(
  '/:source/:destination',
  isAuthenticated,
  routeValidation.get,
  routeController.getRoute,
  routeController.getRouteSuccess,
);

export {
  router as routeRouter,
};
