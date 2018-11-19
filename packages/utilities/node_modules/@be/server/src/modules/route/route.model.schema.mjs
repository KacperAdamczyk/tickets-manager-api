import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  sourceAirport: {
    type: mongoose.ObjectId,
    ref: 'Airport',
    required: true,
  },
  destinationAirport: {
    type: mongoose.ObjectId,
    ref: 'Airport',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
});

export {
  routeSchema,
};
