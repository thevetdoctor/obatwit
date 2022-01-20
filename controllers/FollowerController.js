const Sequelize = require("sequelize");
const Users = require('../models').user;
const Followers = require('../models').follower;
const Twits = require('../models').twit;
const Comments = require('../models').comment;
const Likes = require('../models').like;
const LikeComments = require('../models').likecomment;
const { response } = require('oba-http-response');
const mailer = require("../helpers/mailer");

exports.followUser = async(req, res) => {
    const { userId, followerId } = req.body;
    if(!(userId && followerId)) return response(res, 400, null, 'Please supply missing input(s)');
    if(userId === followerId) return response(res, 400, null, 'User not permitted to follow self');
      try {
            const follower = await Followers.findOne({ 
                where: {
                    userId: followerId,
                    followerId: userId 
                },
                include: [
                    {model: Users, as: 'followeduser',
                        attributes: ['id', 'username', 'email', 'imageUrl', 'verified'],
                    },
                    {model: Users, as: 'followinguser',
                        attributes: ['id', 'username', 'email', 'imageUrl', 'verified'],
                    }
                ],
                raw: true,
                nest: true
            });
            if(follower) {
                if(follower.isFollowed) {
                    return response(res, 400, null, 'User already followed');
                } else {
                    await Followers.update({ isFollowed: true }, { where: {
                        userId: followerId,
                        followerId: userId
                    }});
                    if(follower.followeduser.verified) {
                        await mailer.follow(follower.followeduser.email, follower.followeduser.username, follower.followinguser.username);
                    }
                    return response(res, 200, null, null, 'User is now followed');
                }
            } else {
                await Followers.create({
                    userId: followerId,
                    followerId: userId
                });
                const newFollower = await Followers.findOne({ 
                    where: {
                        userId: followerId,
                        followerId: userId 
                    },
                    include: [
                        {model: Users, as: 'followeduser',
                            attributes: ['id', 'username', 'email', 'imageUrl', 'verified'],
                        },
                        {model: Users, as: 'followinguser',
                            attributes: ['id', 'username', 'email', 'imageUrl', 'verified'],
                        }
                    ],
                    raw: true,
                    nest: true
                });
                if(newFollower.followeduser.verified) {
                    await mailer.follow(newFollower.followeduser.email, newFollower.followeduser.username, newFollower.followinguser.username);
                }
                response(res, 201, null, null, 'User followed');
            }

        }catch(error) {
            if(error.message.search('invalid') >= 0) return response(res, 400, null, 'Invalid input supplied');
            response(res, 500, null, error.message, 'Error in following user');
        }
}; 

exports.getFollowers = async(req, res) => {
    const { userId } = req.body;
    if(!userId) return response(res, 400, null, 'userId is required');
      try {
          const followers = await Users.findOne({ 
              where: { 
                  id: userId
                },
            attributes: ['id', 'username', 'email', 'imageUrl'],
            include: [
                {model: Users, as: 'followers',
                attributes: ['id', 'username', 'email', 'imageUrl'],
                }
            ]
        });
            response(res, 200, followers, null, 'List of followers');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting followers');
        }
}; 

exports.getFollowing = async(req, res) => {
    const { userId } = req.body;
    if(!userId) return response(res, 400, null, 'userId is required');
      try {
        const following = await Users.findOne({ 
            where: { 
                id: userId
              },
            attributes: ['id', 'username', 'email', 'imageUrl'],
            include: [
              {model: Users, as: 'following',
            //   where: {imageUrl: {[Sequelize.Op.ne]: null}},
              attributes: ['id', 'username', 'email', 'imageUrl'],
            //   include: [
            //       {model: Followers, where: {isFollowed: true}}
            //     ]
              }
            ],
        });   
            if(!following) return response(res, 400, null, 'No following found');
            const followingNotFalse = following.following;
            response(res, 200, following, null, 'List of users being followed');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in getting following');
        }
}; 

exports.updateFollowingStatus = async(req, res) => {
    const { userId, followerId } = req.body;
    if(!(userId && followerId)) return response(res, 400, null, 'Please supply missing input(s)');
    if(userId === followerId) return response(res, 400, null, 'User cannot unfollow self');
      try {
            const follower = await Followers.findOne({ where: {
                userId: followerId,
                followerId: userId
            }});
            if(follower) {
                if(!follower.isFollowed) {
                    return response(res, 400, null, 'User already unfollowed');
                } else {
                    await Followers.update({ isFollowed: false }, { where: {
                        userId: followerId,
                        followerId: userId
                    }});
                    return response(res, 200, null, null, 'User is now unfollowed');
                }
            }

        }catch(error) {
            if(error.message.search('invalid') >= 0) return response(res, 400, null, 'Invalid input supplied');
            response(res, 500, null, error.message, 'Error in unfollowing user');
        }
}; 
