const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models').user;
const { response } = require('oba-http-response');
const mailer = require("../helpers/mailer");
const randomId = require('oba-random-id');

exports.signUp = async(req, res) => {
    const { email, password, auth, name } = req.body;
    let username;
    if(!auth) {
        if(!(email && password)) return response(res, 400, null, 'Please supply missing input(s)');
        username = email.split('@')[0];
    } else {
        username = name;
    }
    try {
        const user = await Users.findOne({ where: {
            email
        }});
        if(user) return response(res, 400, null, 'User exists');
        
        if(auth) {
            password = 'google';
        }

            const hash = bcrypt.hashSync(password, 10);
            const newUser = await Users.create({username, email, password: hash});
            newUser.password = null;
            const token = jwt.sign({user: newUser }, process.env.JWT_SECRET);

            await mailer(email);
            response(res, 201, { token, user: newUser }, null, 'Account created');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in creating user');
        }
}; 

exports.logIn = async(req, res) => {
    const { email, password, auth } = req.body;
    if(!auth) {
        if(!(email && password)) return response(res, 400, null, 'Please supply missing input(s)');
    }
      try {
            const user = await Users.findOne({ where: {
                email
            }});
            if(!user) return response(res, 400, null, 'User does not exist');

            if(!auth) {
                if(bcrypt.compareSync('google', user.password)) {
                    return response(res, 400, null, 'Please login with the google button');
                }
                const compared = bcrypt.compareSync(password, user.password);
                if(!compared) return response(res, 400, null, 'Invalid credentials');
            }

            user.password = null;
            const token = jwt.sign({user: user }, process.env.JWT_SECRET);

            response(res, 200, { token, user }, null, 'Logged In');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in creating user');
        }
}; 

exports.getUsers = async(req, res) => {
    console.log('user email', req.userEmail, Users);
      try {
            const users = await Users.findAll({
                attributes: ['email']
            });
            console.log(users);
            response(res, 200, { count: users.length, users }, null, 'List of users');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting users');
        }
}; 