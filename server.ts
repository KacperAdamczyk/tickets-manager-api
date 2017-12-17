'use strict';
/* Dependencies */
import * as path from 'path';
import * as express from 'express';
import * as session from 'express-session';
import * as mongoose from 'mongoose';
import * as connect_mongo from 'connect-mongo';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import chalk from 'chalk';


/* Local dependencies */
import passport from './src/passport-config';
import db from './src/database';
import config from './src/config';
import userRouter from './src/routers/user-router';

/* Configuration */

const MongoStore = connect_mongo(session);
const server = express();
db.connect();

server.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db.mongoose.connection })
}));
server.use(express.static(path.join(__dirname, 'dist')));
server.use(helmet());
server.use(cors());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());

server.use(morgan(<any>'dev'));
server.use(userRouter(passport));
 

/* Starting */
console.log(chalk.green('\nStarting the server... \n'));
server.listen(config.port, () => console.log(chalk.green(`Server started on port ${config.port}! \n`)));
//https.createServer(sslOptions, server).listen(port);
