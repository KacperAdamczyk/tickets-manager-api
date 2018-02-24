import chalk from 'chalk';
import * as express from 'express';
import * as mongoose from 'mongoose';

import config from '../src/config';

/* Setting mongoose Promise to ES6 Promise */
(<any> mongoose).Promise = global.Promise;

let connected = false;

function connect(): Promise<any> {
    return mongoose.connect(config.connectionString)
        .then(() => {
            console.log(chalk.green('Connected to database. \n'));
        }, (err: any) => {
            console.log(chalk.red(`\n${err}\n`));
            // return Promise.reject(null);
        });
}

mongoose.connection.on('disconnected', () => {
    console.log(chalk.red('Disconnected from database'));
    connected = false;
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
    connect: connect.bind(null, 0),
    downProtector,
    mongoose,
};
