import { Airport } from '../airport/airport.model';

class PopulateRoute {
  async sourceAirport(req, res, next, code) {
    res.locals.sourceAirport = await Airport.findByCode(code);

    next();
  }

  async destinationAirport(req, res, next, code) {
    res.locals.destinationAirport = await Airport.findByCode(code);

    next();
  }
}

const populateRoute = new PopulateRoute();

export {
  populateRoute,
};
