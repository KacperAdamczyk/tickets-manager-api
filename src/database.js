const mongoose = require('mongoose');
const chalk = require('chalk');

/* Setting mongoose Promise to ES6 Promise */
mongoose.Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

function connect() {
    return mongoose.connect(connectionString, { useMongoClient: true })
        .then((conn) => {
            console.log(chalk.green('Connected to database. \n'));
            return conn;
        }, (err) => {
            console.log(chalk.red(`\n${err}\n`));
        });
}

module.exports = { connect };