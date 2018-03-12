import * as bodyParser from 'body-parser';
import chalk from 'chalk';
import * as connectMongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as path from 'path';

import * as http from 'http';
import config from './src/config';
import db from './src/database';
import passport from './src/passport';
import {serverLog} from './src/routers/common';
import router from './src/routers/router';
import userRouter from './src/routers/user-router';

/* Configuration */
const MongoStore = connectMongo(session);

if (!config.isRunningTest()) {
    db.connect().then(startServer, () => process.abort());
}

const server = express();
let serverInstance: http.Server;

function startServer() {
    /* Middleware */
    server.use(session({
        resave: true,
        saveUninitialized: false,
        secret: config.ServerConfig.sessionSecret,
        store: new MongoStore({mongooseConnection: db.mongoose.connection}),
    }));
    server.use(express.static(path.join(__dirname, 'dist')));
    server.use(helmet());
    server.use(cors());
    server.use(cookieParser());
    server.use(bodyParser.urlencoded({extended: true}));
    server.use(bodyParser.json());
    server.use(passport.initialize());
    server.use(passport.session());

    server.use(morgan('dev'));

    server.use(db.downProtector);
    server.use(userRouter(passport));
    server.use(router);

    /* Starting */
    serverLog(chalk.green('\nStarting the server... \n'));
    serverInstance = server.listen(config.ServerConfig.port, () =>
        serverLog(chalk.green(`Server started on port ${config.ServerConfig.port}! \n`)));
// https.createServer(sslOptions, server).listen(port);
}

export {
    server as default,
    serverInstance,
    startServer,
    db
};
