import { enhance, InternalError } from '@be/core';

import { Ticket } from './ticket.model';
import { ticketErrors } from './ticket.messages';
import { Route } from '../route/route.model';

class TicketPopulate {
  async populate(req, res) {
    const { id } = req.params;

    res.locals.ticket = await Ticket.findById(id);

    if (!res.locals.ticket) throw new InternalError(ticketErrors.ticketNotFound);
  }

  async populateForUser(req, res) {
    const { id: _id } = req.params;
    const { user } = req;

    res.locals.ticket = await Ticket.findOne({
      _id,
      user,
    });

    if (!res.locals.ticket) throw new InternalError(ticketErrors.ticketNotFound);
  }

  async populateAllForUser(req, res) {
    const { user } = req;

    res.locals.tickets = await Ticket.find({
      user,
    })
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
    'populateForUser',
    'populateAllForUser',
    'populateRoute',
  ])(TicketPopulate)
);

export {
  ticketPopulate,
};
