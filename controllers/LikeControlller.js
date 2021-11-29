const Sequelize = require("sequelize");
// const sequelize = require('../config/connection');
const Users = require('../models').user;
const Twits = require('../models').twit;
const Likes = require('../models').like;
const { response } = require('oba-http-response');

exports.likeTwit = async(req, res) => {
    const { twitId } = req.params;
    const { userId } = req.body;
    if(!(twitId && userId)) return response(res, 400, null, 'Please supply missing input(s)');
    console.log(twitId, userId);
    try {
        const twitExist = await Twits.findOne({ 
            where: {
                id: twitId,
                isDeleted: false
            },
            raw: true
        });
        if(!twitExist) return response(res, 400, null, 'Twit not found');
        const like = await Likes.findOne({ 
            where: {
                twitId,
                userId
            },
            raw: true
        });
        if(like) {
                console.log(like ? 'liked' : 'unliked');
                if(like.isLiked) {
                    console.log('about to be unliked');
                    await Likes.update({
                        isLiked: false
                    }, 
                    { 
                        where: { twitId }
                    });
                    const likedTwit = await Twits.update({
                        likecount: Sequelize.literal('likecount - 1')
                    },
                    { 
                        where: { id: twitId },
                        include: [
                            { model: Likes, as: 'likes',
                                include: [
                                    { model: Users, as: 'userlikes' }
                                ]
                            }
                        ],
                        returning: true
                    });
                    const twit = await Twits.findOne({
                            where: {
                                id: twitId,
                                isDeleted: false
                            },
                            include: [
                                { model: Likes, as: 'likes',
                                    include: [
                                        { model: Users, as: 'userlikes' }
                                    ]
                                }
                            ]
                        });
                    return response(res, 200, { likedTwit, twit }, null, 'Twit unliked successfully');
                } else {
                    console.log('about to be liked again');
                    await Likes.update({
                        isLiked: true
                    }, 
                    { 
                        where: { twitId }
                    });
                    const likedTwit = await Twits.update({
                        likecount: Sequelize.literal('likecount + 1')
                    }, 
                    { 
                        where: { id: twitId },
                        include: [
                            { model: Likes, as: 'likes',
                                include: [
                                    { model: Users, as: 'userlikes' }
                                ]
                            }
                        ],
                        returning: true
                    });
                    const twit = await Twits.findOne({
                        where: {
                            id: twitId,
                            isDeleted: false
                        },
                        include: [
                            { model: Likes, as: 'likes',
                                include: [
                                    { model: Users, as: 'userlikes' }
                                ]
                            }
                        ]
                    });
                    return response(res, 200, { likedTwit, twit }, null, 'Twit liked successfully');
                }
            } else {
                console.log('first-time like');
                const newLike = await Likes.create({ twitId, userId });
                const likedTwit = await Twits.update({
                    likecount: Sequelize.literal('likecount + 1')
                }, 
                { 
                    where: { id: twitId },
                    include: [
                        { model: Likes, as: 'likes',
                            include: [
                                { model: Users, as: 'userlikes' }
                            ]
                        }
                    ],
                    returning: true
                });
                const twit = await Twits.findOne({
                    where: {
                        id: twitId,
                        isDeleted: false
                    },
                    include: [
                        { model: Likes, as: 'likes',
                            include: [
                                { model: Users, as: 'userlikes' }
                            ]
                        }
                    ]
                });
                return response(res, 201, { likedTwit, twit }, null, 'Twit liked successfully');

            }
        }catch(error) {
            response(res, 500, null, error.message, 'Error in liking twit');
        }
}; 
