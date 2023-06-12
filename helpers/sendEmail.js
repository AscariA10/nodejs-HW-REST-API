const nodemailer = require('nodemailer');
require('dotenv').config();

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
   host: 'smtp.ukr.net',
   port: 465,
   secure: true,
   auth: {
      user: UKR_NET_EMAIL,
      pass: UKR_NET_PASSWORD,
   },
};

const transport = nodemailer.createTransport(nodemailerConfig);

async function sendEmail(data) {
   const email = { ...data, from: UKR_NET_EMAIL };
   await transport.sendMail(email);
   return true;
}

module.exports = sendEmail;

// const Mailjet = require('node-mailjet');
// // require('dotenv').config();

// const { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC, MJ_SENDER_EMAIL } = process.env;

// const mailjet = new Mailjet({
//    apiKey: MJ_APIKEY_PUBLIC,
//    apiSecret: MJ_APIKEY_PRIVATE,
// });

// async function sendEmail(data) {
//    const { sendTo, subject, html } = data;

//    await mailjet.post('send', { version: 'v3.1' }).request({
//       Messages: [
//          {
//             From: {
//                Email: MJ_SENDER_EMAIL,
//                // Name: 'Mailjet Pilot',
//             },
//             To: [
//                {
//                   Email: sendTo,
//                },
//             ],
//             Subject: subject,
//             TextPart: 'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
//             HTMLPart: html,
//          },
//       ],
//    });

//    return true;

//    // request
//    //    .then(result => {
//    //       console.log(result.body);
//    //    })
//    //    .catch(err => {
//    //       console.log(err.statusCode);
//    //    });
// }

// const email = {
//    from: GMAIL_EMAIL,
//    to: 'padicin218@peogi.com',
//    subject: 'verify',
// };

// transport
//    .sendMail(email)
//    .then(() => console.log('success'))
//    .catch(error => error.message);
