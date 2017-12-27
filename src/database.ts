import chalk from 'chalk';
import * as express from 'express';
import * as mongoose from 'mongoose';

/* Setting mongoose Promise to ES6 Promise */
(<any> mongoose).Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

const timeout = 5000;
let connected = false;

function connect(wait = timeout): void {
    setTimeout(
        () => {
            mongoose.connect(connectionString, <mongoose.ConnectionOptions> { useMongoClient: true })
                .then(() => {
                    console.log(chalk.green('Connected to database. \n'));
                }, (err: any) => {
                    console.log(chalk.red(`\n${err}\n`));
                    console.log(chalk.blue(`Attempting to reconnect in ${timeout}ms \n`));
                });
        },
        wait,
    );
}

mongoose.connection.on('disconnected', () => {
    console.log(chalk.red('Disconnected from database'));
    connected = false;
    connect();
});

mongoose.connection.on('connected', () => {
    connected = true;
});

function downProtector(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (connected) {
        return next();
    }
    res.sendStatus(500);
}

export default {
    mongoose,
    connect: connect.bind(null, 0),
    downProtector,
};
