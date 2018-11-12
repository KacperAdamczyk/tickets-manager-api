import { enhance } from '@be/core';

import { Airport } from './airport.model';
import { airportDetails } from './airport.mappers';

class AirportController {
  async getFiltered(req, res) {
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
  }

  getFilteredSuccess(req, res) {
    res.send(res.locals.airports.map(airportDetails));
  }
}

const airportController = new (
  enhance([
    'getFiltered',
  ])(AirportController)
);

export {
  airportController,
};
