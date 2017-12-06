'use strict';
/* Dependencies */
const fs = require('fs');
const https = require('https');
const path = require('path');
const chalk = require('chalk');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');


/* Local dependencies */
const router = require('./src/routes');
const db = require('./src/database');

/* Configuration */
const server = express();
server.use(express.static(path.join(__dirname, 'dist')));
server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(router);

const sslOptions = {
    key: fs.readFileSync('certificate/ukey.pem'),
    cert: fs.readFileSync('certificate/cert.pem')
};

const port = 8080; //8443;

/* Starting */
console.log(chalk.yellow('\nStarting the server... \n'));
server.listen(port, () => console.log(chalk.green(`Server started on port ${port}! \n`)));
//https.createServer(sslOptions, server).listen(port);
db.connect(100);
