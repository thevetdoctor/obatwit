const {Sequelize, Op} = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models').user;
const Followers = require('../models').follower;
const { response } = require('oba-http-response');
const mailer = require("../helpers/mailer");
const randomId = require('oba-random-id');
const {createClient} = require('redis');
require('dotenv').config();

// const client = process.env.NODE_ENV !== 'development' ? createClient({url: process.env.REDIS_URL}) : createClient();
// client.connect();

exports.signUp = async(req, res) => {
    let { email, password, auth, name, imageUrl } = req.body;
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

            await mailer.signup(email, username);
            response(res, 201, { token, user: newUser }, null, 'Account created');
        }catch(error) {
            console.log(error)
            response(res, 500, null, error.message, 'Error in creating user');
        }
}; 

exports.logIn = async(req, res) => {
    let { email, password, auth, imageUrl } = req.body;
    if(!auth) {
        if(!(email && password)) return response(res, 400, null, 'Please supply missing input(s)');
    }
      try {
            let user = await Users.findOne({ where: {
                email
            }, raw: true});
            if(!user) {
                if(auth) {
                    password = 'google';
                    const hash = bcrypt.hashSync(password, 10);
                    user = await Users.create({username: email.split('@')[0], email, password: hash, imageUrl});
                    user.password = null;
                    await mailer.signup(email, email.split('@')[0]);

                    user.password = null;
                    const token = jwt.sign({user: user }, process.env.JWT_SECRET);
        
                    response(res, 201, { token, user, newUser: true }, null, 'Signed Up');
                    // const users = await Users.findAll({
                    //     attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'createdAt', 'bio', 'dob', 'location', 'mobile'],
                    //     include: [
                    //         {model: Users, as: 'followers',
                    //         attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    //         },
                    //         {model: Users, as: 'following',
                    //         attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    //         }
                    //       ]
                    // });
                    // client.set('users', JSON.stringify({ count: users.length, users }));

                } else { 
                    return response(res, 400, null, 'User does not exist');
                }
            }
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

            response(res, 200, { token, user, newUser: false }, null, 'Logged In');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in creating user');
        }
}; 

exports.getUsers = async(req, res) => {
      try {
        // const data = await client.get('users')
        //       if(data !== null) {
        //           const { users } = JSON.parse(data);
        //           console.log('cache found');
        //           return response(res, 200, { count: users.length, users }, null, 'Cached list of users');
        //         } else {
        //             console.log('cache not found');
                    const users = await Users.findAll({
                attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'createdAt', 'bio', 'dob', 'location', 'mobile'],
                include: [
                    {model: Users, as: 'followers',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    },
                    {model: Users, as: 'following',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    }
                  ]
            });
            // client.set('users', JSON.stringify({ count: users.length, users }));
            // client.quit();

            response(res, 200, { count: users.length, users }, null, 'List of users');
        // }
        }catch(error) { 
            response(res, 500, null, error.message, 'Error in getting users');
        }
}; 

exports.getUserProfile = async(req, res) => {
    const { username } = req.params;
    try {
            const user = await Users.findOne({ 
                where: { 
                    username 
                },
                attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'createdAt', 'bio', 'dob', 'location', 'mobile'],
                include: [
                    {model: Users, as: 'followers',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    },
                    {model: Users, as: 'following',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'dob', 'location', 'mobile'],
                    }
                  ]
            });
            if(!user) return response(res, 400, null, 'User not found');
            response(res, 200, { user }, null, 'User data');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting users');
        }
}; 

exports.verifyUser = async(req, res) => {
    const { username } = req.params;
    try {
            const user = await Users.update({verified: true}, { 
                where: { 
                    username 
                },
            });
            if(!user) return response(res, 400, null, 'User not found');
            response(res, 200, { user }, null, 'User account has been verified');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in verifying user');
        }
}; 

exports.verifyUsers = async(req, res) => {
    let { users } = req.body;
    try {
            if(!users) return response(res, 400, null, 'At least one email is required');
            const userss = users.map(x => ({email: x}));
            const user = await Users.update({verified: true}, { 
                where: { 
                    [ Op.or ]: userss
                },
            });
            // console.log(users)
            // users.forEach(async userEmail => {
            //     await Users.update({verified: true}, { 
            //         where: { 
            //             email: userEmail
            //         },
            //     });
            // });
            response(res, 200, null, null, 'All user accounts have been verified');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in verifying user accounts');
        }
}; 

exports.getAllUserEmails = async(req, res) => {
    try {
            const users = await Users.findAll({
                attributes: ['email']
            });
            const emails = users.map(x => x.email);
            response(res, 200, emails, null, 'All user emails');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in verifying user accounts');
        }
}; 

exports.updateUserInfo = async(req, res) => {
    let { userId, name, bio, location, dob, mobile } = req.body;

    try {
        if(!(name || bio || location || dob || mobile)) return response(res, 400, null, 'Please supply missing input(s)');
        const users = await Users.findByPk(userId);
        if(!users) response(res, 400, null, null, 'User not found');
            await Users.update({name, bio, location, dob, mobile}, {where: {id: userId}});
            const user = await Users.findOne({
                where: {
                    id: userId
                },
                attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'createdAt', 'bio', 'location', 'dob', 'mobile'],
                include: [
                    {model: Users, as: 'followers',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'location', 'dob', 'mobile'],
                    },
                    {model: Users, as: 'following',
                    attributes: ['id', 'name', 'username', 'email', 'imageUrl', 'bio', 'location', 'dob', 'mobile'],
                    }
                  ]
            })
            response(res, 200, user, null, 'User information updated successfully');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in updating user information');
        }
}; 

exports.updateUserImage = async(req, res) => {
    let { imageUrl, userId } = req.body;

    try {
        if(!imageUrl) return response(res, 400, null, 'Please supply missing input(s)');
        const user = await Users.findByPk(userId);
        if(!user) response(res, 400, null, null, 'User not found');
            await Users.update({imageUrl}, {where: {id: userId}});
         
            response(res, 200, null, null, 'User profile image updated successfully');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in updating user profile image');
        }
}; 