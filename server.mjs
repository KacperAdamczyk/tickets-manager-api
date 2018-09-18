import 'dotenv/config';
import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';

import { log } from './src/helpers/log';
import { connect as connectToDb, downProtector } from './src/database';
import { router } from './src/config/router';
import { errorHandler } from './src/helpers/middlewares/errorHandler';
import { sendResponseObject } from './src/helpers/middlewares/response';

import './src/config/passport';

/* Configuration */
const MongoStore = connectMongo(session);
const server = express();

connectToDb();

const { SESSION_SECRET, PORT } = process.env;

/* Middleware */
server.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
server.use(helmet());
server.use(cors());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());
server.use(morgan('dev'));

server.use(downProtector());
server.use(sendResponseObject());
server.use(router);

server.use(errorHandler());

/* Starting */
log.info('\nStarting the server... \n');
server.listen(PORT, () => log.ok(`Server started on port ${PORT}! \n`));

// @dec
// class A {}
// function dec(instance) {
//     return instance;
// }
