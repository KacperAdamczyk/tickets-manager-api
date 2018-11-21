import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true,
  },
  route: {
    type: mongoose.ObjectId,
    ref: 'Route',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

export {
  ticketSchema,
};
