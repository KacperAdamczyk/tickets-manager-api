import * as nodemailer from 'nodemailer';
import chalk from 'chalk';

let transporter: Promise<any> = new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account: nodemailer.TestAccount) => {
        if (err) {
            return reject(err);
        }
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        resolve(transporter);
    });
});

export function sendActivation(to: string, link: string) {
        let mailOptions = {
            from: '"BE Air" <no-replay@beair.com>',
            to,
            subject: 'Your verification link',
            html: '<h3>Hello!</h3>' +
            `<a href="${link}">Click here</a>`
        };

        transporter.then((transporter: nodemailer.Transport) => {
            (<any>transporter).sendMail(<any>mailOptions, (error: any, info: nodemailer.SentMessageInfo) => {
                if (error) {
                    return console.log(error);
                }
                console.log(chalk.blue('Activation message sent: ', info.messageId));
                console.log(chalk.blue('Preview URL: ', <string>nodemailer.getTestMessageUrl(info)));
            });
        }, err => console.log(chalk.red(err)));
}




