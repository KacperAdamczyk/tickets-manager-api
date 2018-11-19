import express from 'express';
import { isAuthenticated } from '@be/core';

import { routeController } from './route.controller';
import { populateRoute } from './route.populate';
import { routeValidation } from './route.validation';

const router = express.Router();

router.param('source', populateRoute.sourceAirport);
router.param('destination', populateRoute.destinationAirport);

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
