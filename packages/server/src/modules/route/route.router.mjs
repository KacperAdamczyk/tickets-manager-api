import express from 'express';
import { isAuthenticated } from '@be/core';

import { routeController } from './route.controller';
import { populateRoute } from './route.populate';
// import { airportValidation } from './airport.validation';

const router = express.Router();

router.param('source', populateRoute.sourceAirport);
router.param('destination', populateRoute.destinationAirport);

router.get(
  '/:source/:destination',
  isAuthenticated,
  // airportValidation.getFiltered,
  routeController.getRoute,
  routeController.getRouteSuccess,
);

export {
  router as routeRouter,
};
