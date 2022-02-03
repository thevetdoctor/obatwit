const nodemailer = require("nodemailer");
require('dotenv').config();

const { MAIL_USER, MAIL_PASS } = process.env;

module.exports = {
signup: async (receiver, username ) => {
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
          <p><a href='https://peaceful-leakey-ce2e49.netlify.app/verify/${username}'>Activate your account</a> to receive notifications</p>
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
    },

follow: async (receiver, username, follower) => {
      const twitMailer = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: MAIL_USER, pass: MAIL_PASS }
        
      });
      const html =  `
        <h2>Hey!, <a href='https://peaceful-leakey-ce2e49.netlify.app/${follower}'>${follower}</a> just followed you on Buzz</h2>
          <p>Just like we told you, this is getting exciting and you are getting noticed.</p>
          <p>The social media space in Africa connects millions of like-minded individuals and organizations with potentially great opportunities.</p>
          <p>You can post, view and search users, also follow and unfollow users.</p>
          <p>We promise more features as we build out this great community</p>
          <p><a href='https://peaceful-leakey-ce2e49.netlify.app/${username}'>View your profile</a></p>
          The <a href='https://peaceful-leakey-ce2e49.netlify.app/twits'>Buzz</a> Team`;

      const mailOptions = {
        from: "Oba Buzz <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Hey! Someone just followed you on Buzz!',
        text: 'You are getting noticed!',
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
    },

like: async (receiver, twitId, likingUser) => {
  console.log(receiver, twitId, likingUser)
      const twitMailer = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: MAIL_USER, pass: MAIL_PASS }
        
      });
      const html =  `
        <h2>Hey!, <a href='https://peaceful-leakey-ce2e49.netlify.app/${likingUser}'>${likingUser}</a> just liked your post on Buzz</h2>
          <p>Just like we told you, this is getting exciting and you are getting noticed.</p>
          <p>The social media space in Africa connects millions of like-minded individuals and organizations with potentially great opportunities.</p>
          <p>You can post, view and search users, also follow and unfollow users.</p>
          <p>We promise more features as we build out this great community</p>
          <p><a href='https://peaceful-leakey-ce2e49.netlify.app/twits/#${twitId}'>View your liked post</a></p>
          The <a href='https://peaceful-leakey-ce2e49.netlify.app/twits'>Buzz</a> Team`;

      const mailOptions = {
        from: "Oba Buzz <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Hey! Someone just liked your post on Buzz!',
        text: 'You are getting noticed!',
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
    },

comment: async (receiver, twitId, commentingUser) => {
  console.log(receiver, twitId, commentingUser)
      const twitMailer = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: MAIL_USER, pass: MAIL_PASS }
        
      });
      const html =  `
        <h2>Hey!, <a href='https://peaceful-leakey-ce2e49.netlify.app/${commentingUser}'>${commentingUser}</a> just commented on your post on Buzz</h2>
          <p>Just like we told you, this is getting exciting and you are getting noticed.</p>
          <p>The social media space in Africa connects millions of like-minded individuals and organizations with potentially great opportunities.</p>
          <p>You can post, view and search users, also follow and unfollow users.</p>
          <p>We promise more features as we build out this great community</p>
          <p><a href='https://peaceful-leakey-ce2e49.netlify.app/twits/#${twitId}'>View your post</a></p>
          The <a href='https://peaceful-leakey-ce2e49.netlify.app/twits'>Buzz</a> Team`;

      const mailOptions = {
        from: "Oba Buzz <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Hey! A comment has been made on your post on Buzz!',
        text: 'Your post is getting attention!',
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
    },

likecomment: async (receiver, commentId, commentLikeUser) => {
  console.log(receiver, commentId, commentingUser)
      const twitMailer = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        host: "smtp.gmail.com",
        auth: { user: MAIL_USER, pass: MAIL_PASS }
        
      });
      const html =  `
        <h2>Hey!, <a href='https://peaceful-leakey-ce2e49.netlify.app/${commentLikeUser}'>${commentLikeUser}</a> just commented on your post on Buzz</h2>
          <p>Just like we told you, this is getting exciting and you are getting noticed.</p>
          <p>The social media space in Africa connects millions of like-minded individuals and organizations with potentially great opportunities.</p>
          <p>You can post, view and search users, also follow and unfollow users.</p>
          <p>We promise more features as we build out this great community</p>
          <p><a href='https://peaceful-leakey-ce2e49.netlify.app/twits/#${commentId}'>View your comment</a></p>
          The <a href='https://peaceful-leakey-ce2e49.netlify.app/twits'>Buzz</a> Team`;

      const mailOptions = {
        from: "Oba Buzz <thevetdoctor@gmail.com",
        to: receiver,
        subject: 'Hey! Your comment has got a like on Buzz!',
        text: 'Your comment is getting attention!',
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
    }
  }