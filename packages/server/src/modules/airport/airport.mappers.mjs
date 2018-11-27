import { pick } from 'ramda';

const airportDetails = pick([
  'name',
  'city',
  'country',
  'iata',
  'icao',
  'latitude',
  'longitude',
  'timezone',
]);

export {
  airportDetails,
};
