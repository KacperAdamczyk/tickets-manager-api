import { enhance } from '@be/core';

import { Ticket } from './ticket.model';
import { ticketMessages } from './ticket.messages';
import { ticketMapper, ticketBriefMapper } from './ticket.mappers';

class TicketController {
  async create(req, res) {
    const { routeId: route, startDate } = req.body;

    res.locals.ticket = await Ticket.create({
      route,
      startDate,
      user: req.user,
    });
  }

  createSuccess(req, res) {
    res.sendResponse(ticketMessages.ticketCreated, { id: res.locals.ticket._id });
  }

  getSuccess(req, res) {
    res.send(ticketMapper(res.locals.ticket));
  }

  getAllSuccess(req, res) {
    res.send(res.locals.tickets.map(ticketBriefMapper));
  }
}

const ticketController = new (
  enhance([
    'create',
  ])(TicketController)
);

export {
  ticketController,
};
