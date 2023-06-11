const Mailjet = require('node-mailjet');
// require('dotenv').config();

const { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC, MJ_SENDER_EMAIL } = process.env;

const mailjet = new Mailjet({
   apiKey: MJ_APIKEY_PUBLIC,
   apiSecret: MJ_APIKEY_PRIVATE,
});

async function sendEmail(data) {
   const { sendTo, subject, html } = data;

   await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
         {
            From: {
               Email: MJ_SENDER_EMAIL,
               // Name: 'Mailjet Pilot',
            },
            To: [
               {
                  Email: sendTo,
               },
            ],
            Subject: subject,
            TextPart: 'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
            HTMLPart: html,
         },
      ],
   });

   return true;

   // request
   //    .then(result => {
   //       console.log(result.body);
   //    })
   //    .catch(err => {
   //       console.log(err.statusCode);
   //    });
}

module.exports = sendEmail;
