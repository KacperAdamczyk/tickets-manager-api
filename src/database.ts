import * as mongoose from 'mongoose';
import chalk from 'chalk';

/* Setting mongoose Promise to ES6 Promise */
(<any>mongoose).Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

function connect(): any {
    return mongoose.connect(connectionString, <mongoose.ConnectionOptions>{ useMongoClient: true })
        .then(() => {
            console.log(chalk.green('Connected to database. \n'));
        }, (err: any) => {
            console.log(chalk.red(`\n${err}\n`));
        });
}

export default { connect, mongoose };