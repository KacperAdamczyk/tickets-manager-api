const mongoose = require('mongoose');
const chalk = require('chalk');

/* Setting mongoose Promise to ES6 Promise */
mongoose.Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

let timeUntilNextTry = 1000;

let tries = 1;
function connect(repeat = -1) {
    mongoose.connect(connectionString, { useMongoClient: true })
        .then(() => {
            console.log(chalk.green('Connected to database. \n'));
        }, (err) => {
            let retry = Boolean(++tries < repeat || repeat < 0);
            console.log(chalk.red(`\n${err} \n${retry ? `Repeating in ${timeUntilNextTry}ms ${repeat < 0 ? '' : `[${repeat - tries + 1} left]`}\n`: ''}`));
            setTimeout(() => {
                if (retry) connect(repeat);
                }, timeUntilNextTry);
        });
}

module.exports = { connect };