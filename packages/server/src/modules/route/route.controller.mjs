import { enhance } from '@be/core';

import { Route } from './route.model';
// import { airportDetails } from './airport.mappers';

class RouteController {
  async getRoute(req, res) {
    const { sourceAirport, destinationAirport } = res.locals;
console.log(sourceAirport, destinationAirport);
    res.locals.routes = await Route.find({ sourceAirport, destinationAirport });
  }

  getRouteSuccess(req, res) {
    res.send(res.locals.routes);
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
