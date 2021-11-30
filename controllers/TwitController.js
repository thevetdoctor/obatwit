const Sequelize = require("sequelize");
const Users = require('../models').user;
const Twits = require('../models').twit;
const Comments = require('../models').comment;
const Likes = require('../models').like;
const { response } = require('oba-http-response');

exports.postTwit = async(req, res) => {
    const { title, text, userId } = req.body;
    if(!(title && text && userId)) return response(res, 400, null, 'Please supply missing input(s)');
    console.log(title, text, userId);
      try {
            const twit = await Twits.findOne({ where: {
                title,
                isDeleted: false
            }});
            if(twit) return response(res, 400, null, 'Twit already sent');

            const newTwit = await Twits.create(req.body);
            response(res, 201, newTwit, null, 'Twit sent successfully');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in sending twit');
        }
}; 

exports.getTwits = async(req, res) => {
      try {
            const twits = await Twits.findAll({ 
                where: { 
                        isDeleted: false
                    },
                include: [
                    { model: Comments, as: 'comments' },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email']
                        }
                        ]
                    }
                ]
                });

            response(res, 200, twits, null, 'List of twits');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in fetching twits');
        }
}; 

exports.getTwit = async(req, res) => {
    const { twitId } = req.params;
    if(!twitId) return response(res, 400, null, 'Please supply missing input(s)');

      try {
            const twit = await Twits.findOne({ 
                where: { 
                        id: twitId,
                        isDeleted: false
                    },
                include: [
                    { model: Comments, as: 'comments' },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email']
                         }
                        ]
                    }
                ]
            });

            if(!twit) return response(res, 400, null, 'Twit not found');
            response(res, 200, twit, null, 'Twit fetched');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in fetching twit');
        }
}; 

exports.updateTwit = async(req, res) => {
    const { twitId } = req.params;
    const { title, text, userId } = req.body;
    if(!(title && text && userId && twitId)) return response(res, 400, null, 'Please supply missing input(s)');
    console.log(title, text, userId);

      try {
            const twit = await Twits.findOne({ 
                where: { 
                        id: twitId,
                        isDeleted: false
                    },
                include: [
                    { model: Comments, as: 'comments' },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email']
                         }
                        ]
                    }
                ]
            });
            if(!twit) return response(res, 400, null, 'Twit not found');
            await Twits.update({ title, text }, { where: { id: twitId }});
            
            const updatedTwit = await Twits.findByPk(twitId, {
                include: [
                    { model: Comments, as: 'comments' },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email']
                         }
                        ]
                    }
                ]
            });
            response(res, 200, updatedTwit, null, 'Twit updated');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in updating twit');
        }
};

exports.deleteTwit = async(req, res) => {
    const { twitId } = req.params;
    if(!twitId) return response(res, 400, null, 'Please supply missing input(s)');

      try {
            const twit = await Twits.findOne({ 
                where: { 
                        id: twitId,
                        isDeleted: false
                    }
                }, {
                include: [
                    { model: Likes, as: 'likes' }
                ]
            });
            if(!twit) return response(res, 400, null, 'Twit not found');
            await Twits.update({ isDeleted: true }, { where: { id: twitId }});
            
            const updatedTwit = await Twits.findByPk(twitId, {
                where: {
                    isDeleted: false
                }
            });
            response(res, 200, updatedTwit, null, 'Twit deleted');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in deleting twit');
        }
}; 
