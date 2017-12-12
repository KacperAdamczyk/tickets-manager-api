'use strict';
/* Dependencies */
const path = require('path');
const chalk = require('chalk');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/* Local dependencies */
const passport = require('./src/passport');
const router = require('./src/routes');
const db = require('./src/database');
const config = require('./src/config');

/* Configuration */
const server = express();
server.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ dbPromise: db.connect() })
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
server.use(router(passport));


/* Starting */
console.log(chalk.yellow('\nStarting the server... \n'));
server.listen(config.port, () => console.log(chalk.green(`Server started on port ${config.port}! \n`)));
//https.createServer(sslOptions, server).listen(port);
