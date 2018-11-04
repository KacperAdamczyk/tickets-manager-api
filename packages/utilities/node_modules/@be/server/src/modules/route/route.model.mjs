import mongoose from 'mongoose';

import { routeSchema } from './route.model.schema';

class Route extends mongoose.Model {
}

const RouteModel = mongoose.model(Route, routeSchema);

export {
  RouteModel as Route,
};
