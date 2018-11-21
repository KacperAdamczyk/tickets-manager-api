import mongoose from 'mongoose';

import { ticketSchema } from './ticket.model.schema';

class Ticket extends mongoose.Model {
}

const TicketModel = mongoose.model(Ticket, ticketSchema);

export {
  TicketModel as Ticket,
};
