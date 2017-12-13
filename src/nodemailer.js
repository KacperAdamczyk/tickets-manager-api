const nodemailer = require('nodemailer');
const chalk = require('chalk');

let transporter = new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
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

function sendActivation(to, link) {
        let mailOptions = {
            from: '"BE Air" <no-replay@beair.com>',
            to, // list of receivers
            subject: 'Your verification link',
            html: '<h3>Hello!</h3>' +
            `<a href="${link}">Click here</a>`
        };

        transporter.then(transporter => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log(chalk.blue('Activation message sent: ', info.messageId));
                console.log(chalk.blue('Preview URL: ', nodemailer.getTestMessageUrl(info)));
            });
        }, err => console.log(chalk.red(err)));
}

module.exports = { sendActivation };



