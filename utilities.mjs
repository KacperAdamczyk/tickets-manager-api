import './env';

import { load as loadAirports } from './packages/utilities/airports';
import { load as loadRoutes } from './packages/utilities/routes';

loadAirports()
  .then(() => console.log('Inserted airports!'))
  .then(loadRoutes)
  .then(() => console.log('Inserted routes!'))
  .then(process.exit, process.exit);
