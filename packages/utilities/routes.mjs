import { connect } from '@be/server/src/config/database';
import { Airport } from '@be/server/src/modules/airport/airport.model';
import { Route } from '@be/server/src/modules/route/route.model';

import { loader } from './helpers/loader';
import { parser } from './helpers/parser';

const insertToDb = async routes => {
  try {
    await Route.collection.drop();
  } catch (error) {
    if (error.code === 26) console.log('Routes collection does not exist');
  }
  try {
    const airports = await Airport.find({});
    const iataMap = airports.reduce((codes, { iata, _id }) => ({ ...codes, [iata]: _id }), {});
    const icaoMap = airports.reduce((codes, { icao, _id }) => ({ ...codes, [icao]: _id }), {});

    const tasks = routes.map(route => {
      const sourceAirport = iataMap[route.sourceAirport]
      || icaoMap[route.sourceAirport];
      const destinationAirport = iataMap[route.destinationAirport]
      || icaoMap[route.destinationAirport];

      if (!(sourceAirport && destinationAirport)) return null;

      return {
        insertOne: {
          document: {
            ...route,
            sourceAirport,
            destinationAirport,
          },
        },
      };
    }).filter(task => !!task);

    await Route.bulkWrite(tasks);
  } catch (error) {
    console.log(error);
  }
};

const parseRoutes = ([routes]) => {
  const parsed = parser([
    'airline',
    'airlineID',
    'sourceAirport',
    'sourceAirportID',
    'destinationAirport',
    'destinationAirportID',
    'codeshare',
    'stops',
    'equipment',
  ])()([
    'sourceAirport',
    'destinationAirport',
    'airline',
  ])(routes);

  return insertToDb(parsed);
};

const load = async () => Promise.all([
  loader('packages/utilities/data/routes.dat'),
  connect(),
]).then(parseRoutes);

export {
  load,
};
