import R from 'ramda';

const airportDetails = R.pick([
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
