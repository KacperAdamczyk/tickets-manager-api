import { enhance, InternalError } from '@be/core';

import { Ticket } from './ticket.model';
import { ticketErrors } from './ticket.messages';
import { Route } from '../route/route.model';

class TicketPopulate {
  async populate(req, res, _id) {
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
  }

  async populateAll(req, res) {
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
  }

  async populateRoute(req, res) {
    const { routeId } = req.body;

    res.locals.route = await Route.findById(routeId);

    if (!res.locals.route) throw new InternalError(ticketErrors.routeNotFound);
  }
}

const ticketPopulate = new (
  enhance([
    'populate',
    'populateAll',
    'populateRoute',
  ])(TicketPopulate)
);

export {
  ticketPopulate,
};
