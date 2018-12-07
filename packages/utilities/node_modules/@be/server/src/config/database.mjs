import mongoose from 'mongoose';
import { log } from '@be/core';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const { DATABASE_CONNECTION_STRING } = process.env;

let connected = false;

const connect = () => mongoose.connect(DATABASE_CONNECTION_STRING, { useNewUrlParser: true })
  .catch(err => (log.error(`${err}\n`), Promise.reject(err)));

mongoose.connection.on('disconnected', () => {
  log.error('Disconnected from database.');
  log.info('Attempting to reconnect...');
  connect();
  connected = false;
});

mongoose.connection.on('connected', () => {
  log.ok('Connected to database!');
  connected = true;
});

const downProtector = () => (req, res, next) => {
  if (connected) {
    return next();
  }
  res.sendStatus(500);
};

export {
  connect,
  downProtector,
};
