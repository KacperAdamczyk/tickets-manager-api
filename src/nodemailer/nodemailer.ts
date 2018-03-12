import chalk from 'chalk';
import * as nodemailer from 'nodemailer';
import {serverLog} from '../routers/common';

const transporter: Promise<any> = new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account: nodemailer.TestAccount) => {
        if (err) {
            return reject(err);
        }
        const transporterInstance = nodemailer.createTransport({
            auth: {
                user: account.user,
                pass: account.pass,
            },
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
        });
        resolve(transporterInstance);
    });
});

export function sendActivation(to: string, link: string) {
    const mailOptions = {
        from: '"BE Air" <no-replay@beair.com>',
        to,
        subject: 'Your activation link',
        html: '<h3>Hello!</h3>' +
        `<a href="${link}">Click here</a>`,
    };
    transporter.then((transporterInstance: nodemailer.Transport) => {
        (<any> transporterInstance).sendMail(<any> mailOptions, (error: any, info: nodemailer.SentMessageInfo) => {
            if (error) {
                return serverLog(error);
            }
            serverLog(chalk.blue('Activation message sent: ', info.messageId));
            serverLog(chalk.blue('Preview URL: ', <string> nodemailer.getTestMessageUrl(info)));
        });
    }, (err) => serverLog(chalk.red(err)));
}
