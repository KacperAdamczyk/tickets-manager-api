import mongoose from 'mongoose';

import { airportSchema } from './airport.model.schema';

class Airport extends mongoose.Model {
  static findByCode(code) {
    return this.findOne({
      $or: [
        { iata: code },
        { icao: code },
      ],
    });
  }
}

const AirportModel = mongoose.model(Airport, airportSchema);

export {
  AirportModel as Airport,
};
