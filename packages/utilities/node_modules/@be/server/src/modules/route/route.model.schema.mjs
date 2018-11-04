import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  sourceAirport: {
    type: mongoose.ObjectId,
    ref: 'airport',
    required: true,
  },
  destinationAirport: {
    type: mongoose.ObjectId,
    ref: 'airport',
    required: true,
  },
  airline: String,
});

export {
  routeSchema,
};
