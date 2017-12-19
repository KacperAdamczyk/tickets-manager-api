import chalk from 'chalk';
import * as express from 'express';
import * as mongoose from 'mongoose';

/* Setting mongoose Promise to ES6 Promise */
(<any> mongoose).Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

let connected = false;

function connect(maxTries = 10, timeout = 5000): void {
    let n = 0;
    reconnect();
    function reconnect(): void {
        connected = false;
        mongoose.connect(connectionString, <mongoose.ConnectionOptions>{ useMongoClient: true })
            .then(() => {
                connected = true;
                console.log(chalk.green('Connected to database. \n'));
            }, (err: any) => {
                console.log(chalk.red(`\n${err}\n`));
                if (++n <= maxTries || maxTries < 0) {
                    console.log(chalk.blue(`Attempting to reconnect in ` +
                        `${timeout}ms ${maxTries > 0 ? `[${n}/${maxTries}]\n` : ''}`));
                    setTimeout(() => reconnect(), timeout);
                }
            });
    }
}
mongoose.connection.on( 'disconnected', () => {
    if (connected) {
        connected = false;
        console.log(chalk.red('Disconnected from database'));
        connect(-1);
    }
} );
mongoose.connection.on( 'connected', () => {
    connected = true;
} );

function downProtector(req: express.Request, res: express.Response, next: express.NextFunction): void {
    console.log(connected);
    if (connected) {
        return next();
    }
    res.status(500).send(`<h1>Internal server error</h1>`);
}

export default {
    mongoose,
    connect,
    downProtector,
};
