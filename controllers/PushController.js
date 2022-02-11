const Sequelize = require("sequelize");
const Users = require('../models').user;
const Push = require('../models').push;
const { response } = require('oba-http-response');

exports.pushCheck = async(req, res) => {
    console.log('check pushes');
    try{
        const pushes = await Push.findAll({
            where: { 
            isDeleted: false
            },
            attributes: ['createdAt'],
            include: [
                {model: Users, as: 'users',
                    attributes: ['username', 'imageUrl']
                }
            ]
        });
        response(res, 200, pushes, null, 'List of pushIDs');
    }catch(error) {
        response(res, 500, null, error.message, 'Error in fetching pushes');
    }

};