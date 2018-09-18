import chalk from 'chalk';
import * as nodemailer from 'nodemailer';
import { serverLog } from '../routers/common';

const transporter = new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
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

export function sendActivation(to, link) {
    const mailOptions = {
        from: '"BE Air" <no-replay@beair.com>',
        to,
        subject: 'Your activation link',
        html: '<h3>Hello!</h3>' +
        `<a href="${link}">Click here</a>`,
    };
    transporter.then((transporterInstance) => {
        (transporterInstance).sendMail(mailOptions, (error, info) => {
            if (error) {
                return serverLog(error);
            }
            serverLog(chalk.blue('Activation message sent: ', info.messageId));
            serverLog(chalk.blue('Preview URL: ', nodemailer.getTestMessageUrl(info)));
        });
    }, (err) => serverLog(chalk.red(err)));
}
