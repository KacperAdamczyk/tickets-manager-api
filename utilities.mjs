import './env';

import { load as loadAirports } from './packages/utilities/airports';
import { load as loadRoutes } from './packages/utilities/routes';
import { load as loadUsers } from './packages/utilities/users';
import { load as loadTickets } from './packages/utilities/tickets';

loadAirports()
  .then(() => console.log('Inserted airports!'))
  .then(loadRoutes)
  .then(() => console.log('Inserted routes!'))
  .then(loadUsers)
  .then(() => console.log('Inserted users!'))
  .then(loadTickets)
  .then(() => console.log('Inserted tickets!'))
  .then(process.exit, process.exit);
