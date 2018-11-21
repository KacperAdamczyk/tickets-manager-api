import express from 'express';

import { userRouter } from '../modules/user/user.router';
import { airportRouter } from '../modules/airport/airport.router';
import { routeRouter } from '../modules/route/route.router';
import { ticketRouter } from '../modules/ticket/ticket.router';

const mainRouter = express.Router();
const subRouter = express.Router();

mainRouter.use('/api', subRouter);

subRouter.use('/users', userRouter);
subRouter.use('/airports', airportRouter);
subRouter.use('/routes', routeRouter);
subRouter.use('/tickets', ticketRouter);

export {
  mainRouter as router,
};
