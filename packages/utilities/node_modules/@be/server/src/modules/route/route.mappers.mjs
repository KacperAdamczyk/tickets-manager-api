const routeDetails = route => ({
  _id: route._id,
  startTime: route.startTime.valueOf(),
  endTime: route.endTime.valueOf(),
  sourceIata: route.sourceAirport.iata,
  destinationIata: route.destinationAirport.iata,
  distance: route.distance,
});

export {
  routeDetails,
};
