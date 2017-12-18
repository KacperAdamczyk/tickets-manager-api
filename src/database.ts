import * as mongoose from 'mongoose';
import chalk from 'chalk';

/* Setting mongoose Promise to ES6 Promise */
(<any>mongoose).Promise = global.Promise;

/* Connection parameters */
const ip = 'localhost';
const database = 'be-project';
const connectionString = `mongodb://${ip}/${database}`;

let reconnecting = false;

function connect(maxTries = 10, timeout = 5000): void {
    let n = 0;
    reconnect();
    function reconnect(): void {
        reconnecting = true;
        mongoose.connect(connectionString, <mongoose.ConnectionOptions>{ useMongoClient: true })
            .then(() => {
                reconnecting = false;
                console.log(chalk.green('Connected to database. \n'));
            }, (err: any) => {
                console.log(chalk.red(`\n${err}\n`));
                if(++n <= maxTries || maxTries < 0) {
                    console.log(chalk.blue(`Attempting to reconnect in ${timeout}ms ${maxTries > 0 ? `[${n}/${maxTries}]\n` : ''}`));
                    setTimeout(() => reconnect(), timeout);
                }
            });
    }
}
mongoose.connection.on( "disconnected", () => {
    if (!reconnecting) {
        reconnecting = true;
        console.log('disconnected');
        connect(-1);
    }
} );
mongoose.connection.on( "connected", () => {
    reconnecting = false;
} );

export default { connect, mongoose };