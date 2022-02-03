const Sequelize = require("sequelize");
const Users = require('../models').user;
const Comments = require('../models').comment;
const LikeComments = require('../models').likecomment;
const { response } = require('oba-http-response');

exports.likeComment = async(req, res) => {
    const { commentId } = req.params;
    const { userId } = req.body;
    if(!(commentId && userId)) return response(res, 400, null, 'Please supply missing input(s)');
    try {
        const commentExist = await Comments.findOne({ 
            where: {
                id: commentId,
                isDeleted: false
            },
            raw: true
        });
        if(!commentExist) return response(res, 400, null, 'Comment not found');
        const likecomment = await LikeComments.findOne({ 
            where: {
                commentId,
                userId
            },
            raw: true
        });
        if(likecomment) {
                // console.log(like ? 'liked' : 'unliked');
                if(likecomment.isLiked) {
                    // console.log('about to be unliked');
                    await LikeComments.update({
                        isLiked: false
                    }, 
                    { 
                        where: { commentId, userId }
                    }); // Fixed bug to only update specific like record of the user
                    const likedComment = await Comments.update({
                        likecount: Sequelize.literal('likecount - 1')
                    },
                    { 
                        where: { id: commentId }
                    });
                    const comment = await Comments.findOne({
                            where: {
                                id: commentId,
                                isDeleted: false
                            },
                            include: [
                                { model: LikeComments, as: 'likecomments',
                                    include: [
                                        { model: Users, as: 'userlikecomments',
                                attributes: ['username', 'email']
                            }
                                    ]
                                }
                            ]
                        });
                    return response(res, 200, { comment }, null, 'Comment unliked successfully');
                } else {
                    // console.log('about to be liked again');
                    await LikeComments.update({
                        isLiked: true
                    }, 
                    { 
                        where: { commentId, userId }
                    }); // Fixed bug to only update specific like record of the user
                    const likedComment = await Comments.update({
                        likecount: Sequelize.literal('likecount + 1')
                    }, 
                    { 
                        where: { id: commentId }
                    });
                    const comment = await Comments.findOne({
                        where: {
                            id: commentId,
                            isDeleted: false
                        },
                        include: [
                            { model: LikeComments, as: 'likecomments',
                                include: [
                                    { model: Users, as: 'userlikecomments',
                                    attributes: ['username', 'email']
                                }
                                ]
                            }
                        ]
                    });
                    const commentLikeUser = commentExist.likes.filter(x => x.userId === userId)
                    console.log(commentLikeUser[0].userlikes.username, twit.twits.verified)
                    if(commentExist.twits.verified) {
                        await mailer.like(twit.twits.email, twit.id, likingUser[0].userlikes.username);
                    }
                    return response(res, 200, { comment }, null, 'Comment liked successfully');
                }
            } else {
                // console.log('first-time like');
                const newLikeComment = await LikeComments.create({ commentId, userId });
                const likedComment = await Comments.update({
                    likecount: Sequelize.literal('likecount + 1')
                }, 
                { 
                    where: { id: commentId }
                });
                const comment = await Comments.findOne({
                    where: {
                        id: commentId,
                        isDeleted: false
                    },
                    include: [
                        { model: LikeComments, as: 'likecomments',
                            include: [
                                { model: Users, as: 'userlikecomments',
                                attributes: ['username', 'email']
                             }
                            ]
                        }
                    ]
                });
                return response(res, 200, { comment }, null, 'Comment liked successfully');

            }
        }catch(error) {
            response(res, 500, null, error.message, 'Error in liking comment');
        }
}; 
