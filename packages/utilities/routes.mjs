import fns from 'date-fns';
import { connect } from '@be/server/src/config/database';
import { Airport } from '@be/server/src/modules/airport/airport.model';
import { Route } from '@be/server/src/modules/route/route.model';

import { loader } from './helpers/loader';
import { parser } from './helpers/parser';

const max = {
  c: 0,
};
const min = {
  c: Infinity,
};
// min - 116 max - 167 diff - 51 hours - 18 minutes - 1080 minutes/diff = 21 hours 5-23
const charCode = str => str.split('').map(c => c.charCodeAt(0)).reduce((acc, c) => acc + c);
const getTimeFromString = str => {
  const startCode = charCode('A4CBB');
  const endCode = charCode('IOSKYZ');
  const codeDiff = endCode - startCode;
  const offset = 0.05;
  const startHour = 5 + offset;
  const endHour = 23 - offset;
  const hoursDiff = endHour - startHour;
  const fraction = hoursDiff * 60 / codeDiff;
  const code = charCode(str);
  const time = Math.floor(fraction * (code - startCode));

  if (time > max.c) {
    max.c = time;
    max.s = str;
  }
  if (time < min.c) {
    min.c = time;
    min.s = str;
  }

  const date = fns.addMinutes(new Date(0), time + startHour * 60);

  return date;
};

const degreesToRadians = deg => deg * Math.PI / 180;
const calculateDistance = (a, b) => {
  const R = 6371e3;
  const dALat = degreesToRadians(a.latitude);
  const dBLat = degreesToRadians(b.latitude);
  const latDiff = dBLat - dALat;
  const lonDiff = degreesToRadians(b.longitude - a.longitude);

  const x = (Math.sin(latDiff / 2) ** 2)
  + (Math.cos(dALat) * Math.cos(dBLat) * (Math.sin(lonDiff / 2) ** 2));

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return Math.floor(R * c);
};

const insertToDb = async routes => {
  try {
    await Route.collection.drop();
  } catch (error) {
    if (error.code === 26) console.log('Routes collection does not exist');
  }
  try {
    const airports = await Airport.find({});
    const iataMap = airports.reduce((codes, a) => ({ ...codes, [a.iata]: a }), {});
    const icaoMap = airports.reduce((codes, a) => ({ ...codes, [a.icao]: a }), {});

    const tasks = routes.map(route => {
      const sourceAirport = iataMap[route.sourceAirport]
      || icaoMap[route.sourceAirport];
      const destinationAirport = iataMap[route.destinationAirport]
      || icaoMap[route.destinationAirport];

      if (!(sourceAirport && destinationAirport)) return null;

      const avgSpeed = 250;
      const startTime = getTimeFromString(route.airline + sourceAirport.iata);
      const distance = calculateDistance(sourceAirport, destinationAirport);
      const endTime = fns.addMinutes(startTime, Math.floor(distance / avgSpeed / 60));

      return {
        insertOne: {
          document: {
            sourceAirport,
            destinationAirport,
            startTime,
            endTime,
            distance,
          },
        },
      };
    }).filter(task => !!task);

    console.log('min', min, 'max', max);
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
