import { bindAllProps } from '@be/core';

import { Airport } from './airport.model';
import { airportDetails } from './airport.mappers';

class AirportController {
  async getFiltered(req, res, next) {
    const { query } = req.params;
    const { limit, exclude } = req.query;
    const queryRegexp = new RegExp(query, 'i');

    res.locals.airports = await Airport.find({
      $or: ['name', 'iata', 'icao', 'city', 'country'].map(
        key => ({
          [key]: { $regex: queryRegexp, $ne: exclude },
        }),
      ),
    }).limit(limit && +limit);

    next();
  }

  getFilteredSuccess(req, res) {
    res.send(res.locals.airports.map(airportDetails));
  }
}

const airportController = bindAllProps(new AirportController);

export {
  airportController,
};
