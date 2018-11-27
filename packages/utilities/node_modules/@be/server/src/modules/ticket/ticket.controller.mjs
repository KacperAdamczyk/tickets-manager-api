import { bindAllProps } from '@be/core';

import { Ticket } from './ticket.model';
import { ticketMessages } from './ticket.messages';
import { ticketMapper, ticketBriefMapper } from './ticket.mappers';

class TicketController {
  async create(req, res, next) {
    const { routeId: route, startDate } = req.body;

    res.locals.ticket = await Ticket.create({
      route,
      startDate,
      user: req.user,
    });

    next();
  }

  async delete(req, res, next) {
    await Ticket.findByIdAndDelete(res.locals.ticket);

    next();
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

  deleteSuccess(req, res) {
    res.sendResponse(ticketMessages.ticketDeleted);
  }
}

const ticketController = bindAllProps(new TicketController);

export {
  ticketController,
};
