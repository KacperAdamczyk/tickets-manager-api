'use strict';
/* Dependencies */
// const fs = require('fs');
// const https = require('https');
const path = require('path');
const chalk = require('chalk');

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const morgan = require('morgan');

/* Local dependencies */
const passport = require('./src/passport');
const router = require('./src/routes');
const db = require('./src/database');

/* Configuration */
const server = express();
server.use(session({
    secret: 'ilovescotchscotchyscotchscotch',
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
server.use(passport.session()); // persistent login sessions

server.use(morgan('dev'));
server.use(router(passport));

// const sslOptions = {
//     key: fs.readFileSync('certificate/ukey.pem'),
//     cert: fs.readFileSync('certificate/cert.pem')
// };

const port = 8080; //8443;

/* Starting */
console.log(chalk.yellow('\nStarting the server... \n'));
server.listen(port, () => console.log(chalk.green(`Server started on port ${port}! \n`)));
//https.createServer(sslOptions, server).listen(port);
