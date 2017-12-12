const nodemailer = require('nodemailer');
const chalk = require('chalk');

function sendActivation(to, link) {
    nodemailer.createTestAccount((err, account) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        let mailOptions = {
            from: '"BE Air" <no-replay@beair.com>',
            to, // list of receivers
            subject: 'Your verification link',
            html: '<h3>Hello!</h3>' +
            `<a href="${link}">Click here</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log(chalk.blue('Message sent: ', info.messageId));
            console.log(chalk.blue('Preview URL: ', nodemailer.getTestMessageUrl(info)));
            return nodemailer.getTestMessageUrl(info);
        });
    });
}

module.exports = { sendActivation };



