import { bindAllProps, InternalError } from '@be/core';

import { Ticket } from './ticket.model';
import { ticketErrors } from './ticket.messages';
import { Route } from '../route/route.model';

class TicketPopulate {
  async populate(req, res, next, _id) {
    const { user } = req;
    const query = req.isAdmin()
      ? { _id }
      : { _id, user };

    res.locals.ticket = await Ticket.findOne(query)
      .populate([
        {
          path: 'route',
          populate: [
            { path: 'sourceAirport' },
            { path: 'destinationAirport' },
          ],
        },
        { path: 'user' },
      ]);

    if (!res.locals.ticket) throw new InternalError(ticketErrors.ticketNotFound);

    next();
  }

  async populateAll(req, res, next) {
    const query = req.isAdmin()
      ? { user: req.params.user }
      : { user: req.user };

    res.locals.tickets = await Ticket.find(query)
      .populate([
        {
          path: 'route',
          populate: [
            { path: 'sourceAirport' },
            { path: 'destinationAirport' },
          ],
        },
        { path: 'user' },
      ]);

    next();
  }

  async populateRoute(req, res, next) {
    const { routeId } = req.body;

    res.locals.route = await Route.findById(routeId);

    if (!res.locals.route) throw new InternalError(ticketErrors.routeNotFound);

    next();
  }
}

const ticketPopulate = bindAllProps(new TicketPopulate);

export {
  ticketPopulate,
};
