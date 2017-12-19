'use strict';
/* Imports */
import * as bodyParser from 'body-parser';
import chalk from 'chalk';
import * as connect_mongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

/* Local imports */
import config from './src/config';
import db from './src/database';
import passport from './src/passport-config';
import router from './src/routers/router';
import userRouter from './src/routers/user-router';

/* Configuration */

const MongoStore = connect_mongo(session);
const server = express();
db.connect(20);

server.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db.mongoose.connection }),
}));
server.use(express.static(path.join(__dirname, 'dist')));
server.use(helmet());
server.use(cors());
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());

server.use(morgan('dev'));

server.use(db.downProtector);
server.use(router);
server.use(userRouter(passport));

/* Starting */
console.log(chalk.green('\nStarting the server... \n'));
server.listen(config.port, () => console.log(chalk.green(`Server started on port ${config.port}! \n`)));
// https.createServer(sslOptions, server).listen(port);
