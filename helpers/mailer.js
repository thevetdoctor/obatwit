const nodemailer = require("nodemailer");
require('dotenv').config();

const { MAIL_USER, MAIL_PASS } = process.env;

module.exports = async (receiver) => {
      const twitMailer = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: MAIL_USER, pass: MAIL_PASS }
        
      });
      const html =  `
        <h2>Welcome to Buzz</h2>
          <p>You just signed up to the next big thing in the social media space in Africa.</p>
          <p>Connect with millions of like-minded individuals and organizations, and enjoy the power of networking.</p>
          <p>Please update your profile on the app to get more personalised information in your feed and email inbox</p>
          <p>Welcome on board</p>
          The <a href='https://peaceful-leakey-ce2e49.netlify.app/twits'>Buzz</a> Team`;

      const mailOptions = {
        from: "Oba Buzz <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Thanks for signing up!',
        text: 'Welcome to Buzz',
        html,
      };
      await twitMailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return {
            success: false,
            message: "Error found",
            error: error.message
          };
        }
        console.log(`Mail sent to ${receiver}`);
        return { 
          success: true,
          message: `Mail sent to ${receiver}`
        }
      });
    };