import { connect } from '@be/server/src/config/database';
import { Airport } from '@be/server/src/modules/airport/airport.model';
import { Route } from '@be/server/src/modules/route/route.model';

import { loader } from './helpers/loader';
import { parser } from './helpers/parser';

// min - 116 max - 167 diff - 51 hours - 18 minutes - 1080 minutes/diff = 21 hours 5-23
const charCode = str => str.split('').map(c => c.charCodeAt(0)).reduce((acc, c) => acc + c);
const toDoubleChar = str => String(str).length === 1 ? `0${str}` : String(str);
const getTimeFromString = str => {
  const startCode = charCode('2B');
  const endCode = charCode('ZM');
  const codeDiff = endCode - startCode;
  const startHour = 5;
  const endHour = 23;
  const hoursDiff = endHour - startHour;
  const fraction = Math.floor(hoursDiff * 60 / codeDiff);
  const code = charCode(str);
  const time = fraction * (code - startCode);
  const hours = Math.floor(time / 60);
  const minutes = time - hours * 60 + Math.floor((hoursDiff * 60 - fraction * codeDiff) / 2);

  return `${hours + startHour}:${toDoubleChar(minutes)}`;
};

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
            startTime: getTimeFromString(route.airline),
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
    'airline',
    'sourceAirport',
    'destinationAirport',
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
