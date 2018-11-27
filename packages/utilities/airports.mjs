import { propEq } from 'ramda';
import { connect } from '@be/server/src/config/database';
import { Airport } from '@be/server/src/modules/airport/airport.model';

import { loader } from './helpers/loader';
import { parser } from './helpers/parser';

const insertToDb = async airports => {
  try {
    await Airport.collection.drop();
  } catch (error) {
    if (error.code === 26) console.log('Airports collection does not exist');
  }
  try {
    await Airport.bulkWrite(
      airports.map(airport => ({
        insertOne: {
          document: airport,
        },
      })),
    );
  } catch (error) {
    console.log(error);
  }
};

const parseAirports = ([airports]) => {
  const parsed = parser([
    'airportID',
    'name',
    'city',
    'country',
    'iata',
    'icao',
    'latitude',
    'longitude',
    'altitude',
    'timezoneNumber',
    'dst',
    'timezone',
    'type',
    'source',
  ])([
    propEq('iata', '\\N'),
    propEq('iata', ''),
    propEq('city', ''),
  ], [
    propEq('type', 'airport'),
  ])([
    'name',
    'city',
    'country',
    'iata',
    'icao',
    'latitude',
    'longitude',
    'timezone',
  ])(airports);

  return insertToDb(parsed);
};

const load = async () => Promise.all([
  loader('packages/utilities/data/airports-formatted.dat'),
  connect(),
]).then(parseAirports);

export {
  load,
};
