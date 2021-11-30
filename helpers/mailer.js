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
        <h2>Welcome to Twitee</h2>
          <p>You just signed up to the next big thing in the social media space in Africa.</p>
          <p>Connect with millions of like-minded individuals and organizations, and enjoy the power of networking.</p>
          <p>Please update your profile on the app to get more personalised information in your email inbox</p>
          <p>Welcome on board</p>
          Twitee Team`;

      const mailOptions = {
        from: "Oba Twitee <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Thanks for signing up!',
        text: 'Welcome to Twitee',
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