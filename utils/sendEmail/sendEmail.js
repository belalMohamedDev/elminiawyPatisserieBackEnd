const nodemailer = require("nodemailer");

const sendEmail =  (options) => {
  //create Transporter (service that will send email like "gmail","mailgun","mialtrap","sendgrid")
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email option (like from ,to,subject ,email content)
  const mailOptions = {
    from: `super market app <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  //send email
  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
