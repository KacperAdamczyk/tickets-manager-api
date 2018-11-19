import { enhance } from '@be/core';

import { Route } from './route.model';
import { routeDetails } from './route.mappers';

class RouteController {
  async getRoute(req, res) {
    const { sourceAirport, destinationAirport } = res.locals;

    const routes = await Route.find({ sourceAirport, destinationAirport })
      .populate('sourceAirport')
      .populate('destinationAirport');

    routes.sort((a, b) => 2 * (a.startTime > b.startTime) - 1);

    res.locals.routes = routes;
  }

  getRouteSuccess(req, res) {
    res.send(res.locals.routes.map(routeDetails));
  }
}

const routeController = new (
  enhance([
    'getRoute',
  ])(RouteController)
);

export {
  routeController,
};
