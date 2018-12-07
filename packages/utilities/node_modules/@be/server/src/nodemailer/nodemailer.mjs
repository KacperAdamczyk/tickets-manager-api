import { log, callWithOrReturn } from '@be/core';
import nodemailer from 'nodemailer';

const transporterGenerator = new Promise((resolve, reject) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      return reject(err);
    }

    const transporter = nodemailer.createTransport({
      auth: {
        user: account.user,
        pass: account.pass,
      },
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
    });
    resolve(transporter);
  });
});

const sendEmail = (to, template, data) => {
  const mailOptions = {
    from: '"BE Air" <no-replay@be.dd>',
    to,
    subject: callWithOrReturn(template.subject, data),
    html: callWithOrReturn(template.html, data),
  };

  return transporterGenerator
    .then(transporter => transporter.sendMail(mailOptions))
    .then(info => {
      console.log('Email sent: ', nodemailer.getTestMessageUrl(info));

      return info;
    });
};

export {
  sendEmail,
};
