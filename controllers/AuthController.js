const Sequelize = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models').user;
const Followers = require('../models').follower;
const { response } = require('oba-http-response');
const mailer = require("../helpers/mailer");
const randomId = require('oba-random-id');

exports.signUp = async(req, res) => {
    let { email, password, auth, name, imageUrl } = req.body;
    // console.log('image', imageUrl)
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
            const newUser = await Users.create({username, email, password: hash, imageUrl});
            newUser.password = null;
            const token = jwt.sign({user: newUser }, process.env.JWT_SECRET);

            await mailer(email);
            response(res, 201, { token, user: newUser }, null, 'Account created');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in creating user');
        }
}; 

exports.logIn = async(req, res) => {
    const { email, password, auth, imageUrl } = req.body;
    // console.log('image', imageUrl)
    if(!auth) {
        if(!(email && password)) return response(res, 400, null, 'Please supply missing input(s)');
    }
      try {
            const user = await Users.findOne({ where: {
                email
            }, raw: true});
            if(!user) return response(res, 400, null, 'User does not exist');
            // console.log('user', user)
            if(!user.imageUrl) {
                await Users.update({imageUrl}, {where: {email}});
            }
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
    // console.log('user email', req.userEmail, Users);
      try {
            const users = await Users.findAll({
                attributes: ['email']
            });
            // console.log(users);
            response(res, 200, { count: users.length, users }, null, 'List of users');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting users');
        }
}; 

exports.getUserProfile = async(req, res) => {
    const { username } = req.params;
    console.log(username)
    try {
            const user = await Users.findOne({ 
                where: { 
                    username 
                },
                attributes: ['id', 'username', 'email', 'imageUrl', 'createdAt'],
                include: [
                    {model: Users, as: 'followers',
                    attributes: ['id', 'username', 'email', 'imageUrl'],
                    },
                    {model: Users, as: 'following',
                    attributes: ['id', 'username', 'email', 'imageUrl'],
                    }
                  ]
            });
            if(!user) return response(res, 400, null, 'User not found');
            response(res, 200, { user }, null, 'User data');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting users');
        }
}; 