import mongoose from 'mongoose';
import { log } from '@be/core';

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const { DATABASE_IP, DATABASE_PORT, DATABASE_NAME } = process.env;
const connectionString = `mongodb://${DATABASE_IP}:${DATABASE_PORT}/${DATABASE_NAME}`;

let connected = false;

const connect = () => mongoose.connect(connectionString, { useNewUrlParser: true })
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
