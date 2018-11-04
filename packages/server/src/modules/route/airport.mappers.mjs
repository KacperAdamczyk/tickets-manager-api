import R from 'ramda';

const airportDetails = R.pick([
  'name',
  'iata',
  'icao',
]);

export {
  airportDetails,
};
