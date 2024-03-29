const ticketErrors = {
  ticketNotFound: {
    status: 400,
    message: 'Ticket does not exists.',
  },
  routeNotFound: {
    status: 400,
    message: 'Selected route does not exists.',
  },
};

const ticketMessages = {
  ticketCreated: {
    status: 201,
    message: 'Ticket has been booked.',
  },
  ticketDeleted: {
    status: 200,
    message: 'Ticket has been deleted.',
  },
};

export {
  ticketErrors,
  ticketMessages,
};
