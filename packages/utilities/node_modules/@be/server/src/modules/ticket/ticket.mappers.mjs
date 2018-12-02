const ticketMapper = ticket => ({
  id: ticket._id,
  startDate: ticket.startDate,
  purchaseDate: ticket.purchaseDate,
  route: {
    id: ticket.route._id,
    startTime: ticket.route.startTime,
    endTime: ticket.route.endTime,
    distance: ticket.route.distance,
    sourceAirport: {
      id: ticket.route.sourceAirport._id,
      name: ticket.route.sourceAirport.name,
      city: ticket.route.sourceAirport.city,
      country: ticket.route.sourceAirport.country,
      iata: ticket.route.sourceAirport.iata,
      icao: ticket.route.sourceAirport.icao,
      latitude: ticket.route.sourceAirport.latitude,
      longitude: ticket.route.sourceAirport.longitude,
      timezone: ticket.route.sourceAirport.timezone,
    },
    destinationAirport: {
      id: ticket.route.destinationAirport._id,
      name: ticket.route.destinationAirport.name,
      city: ticket.route.destinationAirport.city,
      country: ticket.route.destinationAirport.country,
      iata: ticket.route.destinationAirport.iata,
      icao: ticket.route.destinationAirport.icao,
      latitude: ticket.route.destinationAirport.latitude,
      longitude: ticket.route.destinationAirport.longitude,
      timezone: ticket.route.destinationAirport.timezone,
    },
  },
  user: {
    id: ticket.user._id,
    firstName: ticket.user.firstName,
    lastName: ticket.user.lastName,
  },
});

const ticketBriefMapper = ticket => ({
  id: ticket._id,
  startDate: ticket.startDate,
  route: {
    startTime: ticket.route.startTime,
    endTime: ticket.route.endTime,
    sourceAirport: {
      city: ticket.route.sourceAirport.city,
      timezone: ticket.route.sourceAirport.timezone,
    },
    destinationAirport: {
      city: ticket.route.destinationAirport.city,
      timezone: ticket.route.destinationAirport.timezone,
    },
  },
});

export {
  ticketMapper,
  ticketBriefMapper,
};
