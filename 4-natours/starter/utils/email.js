const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');
const sendEmail = catchAsync(async (options) => {
  // create transporters
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, //nodemailer documentation.
    },
  });
  // define the gmail options
  const mailOptions = {
    from: `DIVONIL LIQUID <DIVONILLIQUID@gmail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //send the email
  await transporter.sendMail(mailOptions);
});
module.exports = sendEmail;
