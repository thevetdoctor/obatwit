const Sequelize = require("sequelize");
const Users = require('../models').user;
const Twits = require('../models').twit;
const Likes = require('../models').like;
const { response } = require('oba-http-response');
const mailer = require("../helpers/mailer");

exports.likeTwit = async(req, res) => {
    const { twitId } = req.params;
    const { userId } = req.body;
    if(!(twitId && userId)) return response(res, 400, null, 'Please supply missing input(s)');
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
            // console.log(like ? 'liked' : 'unliked');
            if(like.isLiked) {
                // console.log('about to be unliked');
                await Likes.update({
                    isLiked: false
                }, 
                { 
                    where: { twitId, userId }
                }); // Fixed bug to only update specific like record of the user
                const likedTwit = await Twits.update({
                    likecount: Sequelize.literal('likecount - 1')
                },
                { 
                    where: { id: twitId }
                });
                const twit = await Twits.findOne({
                        where: {
                            id: twitId,
                            isDeleted: false
                        },
                        include: [
                            { model: Likes, as: 'likes',
                                include: [
                                    { model: Users, as: 'userlikes',
                            attributes: ['username', 'email']
                        }
                                ]
                            }
                        ]
                    });
                return response(res, 200, { twit }, null, 'Twit unliked successfully');
            } else {
                // console.log('about to be liked again');
                await Likes.update({
                    isLiked: true
                }, 
                { 
                    where: { twitId, userId }
                }); // Fixed bug to only update specific like record of the user
                const likedTwit = await Twits.update({
                    likecount: Sequelize.literal('likecount + 1')
                }, 
                { 
                    where: { id: twitId }
                });
                const twit = await Twits.findOne({
                    where: {
                        id: twitId,
                        isDeleted: false
                    },
                    include: [
                        { model: Users, as: 'twits',
                            attributes: ['username', 'email', 'verified']
                        },
                        { model: Likes, as: 'likes',
                            include: [
                                { model: Users, as: 'userlikes',
                                attributes: ['username', 'email', 'verified']
                            }
                            ]
                        }
                    ],
                });
                const likingUser = twit.likes.filter(x => x.userId === userId)
                if(twit.twits.verified) {
                    await mailer.like(twit.twits.email, twit.id, likingUser[0].userlikes.username);
                }
                return response(res, 200, { twit }, null, 'Twit re-liked successfully');
            }
        } else {
            // console.log('first-time like');
            const newLike = await Likes.create({ twitId, userId });
            const likedTwit = await Twits.update({
                likecount: Sequelize.literal('likecount + 1')
            }, 
            { 
                where: { id: twitId }
            });
            const twit = await Twits.findOne({
                where: {
                    id: twitId,
                    isDeleted: false
                },
                include: [
                    { model: Users, as: 'twits',
                        attributes: ['username', 'email', 'verified']
                    },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email', 'verified']
                            }
                        ]
                    }
                ],
            });
            const likingUser = twit.likes.filter(x => x.userId === userId);
            if(twit.twits.verified) {
                await mailer.like(twit.twits.email, twit.id, likingUser[0].userlikes.username);
            }
            return response(res, 201, { twit }, null, 'Twit liked successfully');

        }
        }catch(error) {
            response(res, 500, null, error.message, 'Error in liking twit');
        }
}; 
