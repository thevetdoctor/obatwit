const Sequelize = require("sequelize");
const Users = require('../models').user;
const Twits = require('../models').twit;
const Push = require('../models').push;
const Comments = require('../models').comment;
const Likes = require('../models').like;
const LikeComments = require('../models').likecomment;
const { response } = require('oba-http-response');
const {createClient} = require('redis');
require('dotenv').config();
const webPush = require('web-push');

const {PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY} = process.env;

webPush.setVapidDetails('mailto:thevetdoctor@gmail.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

// const client = process.env.NODE_ENV !== 'development' ? createClient({url: process.env.REDIS_URL}) : createClient();
// client.connect();

// client.on( 'error', function( err ) {
//     console.log( 'Error' + err );
//     client.quit();
//   });

exports.postTwit = async(req, res) => {
    const { text, imageUrl, userId } = req.body;
    if((!text || !imageUrl) && !userId) return response(res, 400, null, 'Please supply missing input(s)');
      try {
            const twit = await Twits.findOne({ where: {
                text,
                isDeleted: false
            }});
            if(twit) return response(res, 400, null, 'Twit already sent');

            const newTwit = await Twits.create(req.body);

            // const twits = await Twits.findAll({ 
            //     where: { 
            //             isDeleted: false
            //         },
            //     include: [
            //         { model: Users, as: 'twits',
            //                 attributes: ['username', 'email', 'imageUrl']
            //         },
            //         { model: Comments, as: 'comments',
            //             include: [
            //                 { model: Users, as: 'usercomments',
            //                     attributes: ['username', 'email', 'imageUrl']
            //                 },
            //                 { model: LikeComments, as: 'likecomments',
            //                     // attributes: ['username', 'email', 'imageUrl']
            //                 }
            //             ]
            //         },
            //         { model: Likes, as: 'likes',
            //             include: [
            //                 { model: Users, as: 'userlikes',
            //                 attributes: ['username', 'email', 'imageUrl']
            //             }
            //             ]
            //         }
            //     ]
            //     });

            // client.set('twits', JSON.stringify(twits));
            // client.quit();

            // send push notifications to subscribed users
            const allPushIds = await Push.findAll({
                attributes: ['text']
            });
            if(allPushIds[0]) {
                allPushIds.forEach(push => {
                    const subscription = JSON.parse(push.text);
                    // console.log(text);
                    const payload = JSON.stringify({ title: 'Buzz', message: text.slice(0, 40), postId: newTwit.id});
                    webPush.sendNotification(subscription, payload).catch(error => console.log(error.message));
                });
            } else {
                console.log('No push IDs in record');
            }

            response(res, 201, newTwit, null, 'Twit sent successfully');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in sending twit');
        }
}; 

exports.getTwits = async(req, res) => {
    try {
        let { page, perPage } = req.query;
        const twitCount = await Twits.count({where: {isDeleted: false}});
        if(page && perPage) {
            page = parseInt(page, 10);
            page = page < 1 ? 1 : page;
            perPage = parseInt(perPage, 10);
            const twits = await Twits.findAll({ 
                where: { 
                        isDeleted: false
                    },
                limit: perPage,
                offset: ((page - 1) * perPage),
                order: [['createdAt', 'DESC']],
              //   attributes: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'twit']],
              //   group: ['twit.id'],
                include: [
                    { model: Users, as: 'twits',
                            attributes: ['username', 'email', 'imageUrl']
                    },
                    { model: Comments, as: 'comments',
                        include: [
                            { model: Users, as: 'usercomments',
                                attributes: ['username', 'email', 'imageUrl']
                            },
                            { model: LikeComments, as: 'likecomments',
                                // attributes: ['username', 'email', 'imageUrl']
                            }
                        ]
                    },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email', 'imageUrl']
                        }
                        ]
                    }
                ]
                });
                response(res, 200, {twits, twitCount, page, perPage}, null, 'List of twits');
        } else {
            const twits = await Twits.findAll({ 
                where: { 
                        isDeleted: false
                    },
                order: [['createdAt', 'DESC']],
                include: [
                    { model: Users, as: 'twits',
                            attributes: ['username', 'email', 'imageUrl']
                    },
                    { model: Comments, as: 'comments',
                        include: [
                            { model: Users, as: 'usercomments',
                                attributes: ['username', 'email', 'imageUrl']
                            },
                            { model: LikeComments, as: 'likecomments',
                                // attributes: ['username', 'email', 'imageUrl']
                            }
                        ]
                    },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email', 'imageUrl']
                        }
                        ]
                    }
                ]
                });
                response(res, 200, {twits, twitCount, page, perPage}, null, 'List of twits');
                
            }
        //   const data = await client.get('twits')
        //   console.log(JSON.parse(data))
        //   client.get('twits', async (err, data) => {
        //       if(err) return response(res, 400, null, null, 'Cache error');
        //   if(data !== null) {
            //       console.log('cache found');
            //       return response(res, 200, JSON.parse(data), null, 'Cached twits');
            //     } else {
                //       console.log('cache not found');
                //   client.set('twits', JSON.stringify(twits));
      //   }
    //   }).catch(err => console.log(err));
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
                    { model: Comments, as: 'comments',
                        include: [
                            { model: Users, as: 'usercomments',
                                attributes: ['username', 'email', 'imageUrl']
                            },
                            { model: LikeComments, as: 'likecomments',
                                // attributes: ['username', 'email', 'imageUrl']
                            }
                        ] 
                    },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email', 'imageUrl']
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
    const { text, userId } = req.body;
    if(!(text && userId && twitId)) return response(res, 400, null, 'Please supply missing input(s)');

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
                            attributes: ['username', 'email', 'imageUrl']
                         }
                        ]
                    }
                ]
            });
            if(!twit) return response(res, 400, null, 'Twit not found');
            await Twits.update({ text }, { where: { id: twitId }});
            
            const updatedTwit = await Twits.findByPk(twitId, {
                include: [
                    { model: Users, as: 'twits',
                            attributes: ['username', 'email', 'imageUrl']
                    },
                    { model: Comments, as: 'comments',
                        include: [
                            { model: Users, as: 'usercomments',
                                attributes: ['username', 'email', 'imageUrl']
                            },
                            { model: LikeComments, as: 'likecomments',
                                // attributes: ['username', 'email', 'imageUrl']
                            }
                        ]
                    },
                    { model: Likes, as: 'likes',
                        include: [
                            { model: Users, as: 'userlikes',
                            attributes: ['username', 'email', 'imageUrl']
                        }
                        ]
                    }
                ]
            });

            // const twits = await Twits.findAll({ 
            //     where: { 
            //             isDeleted: false
            //         },
            //     include: [
            //         { model: Users, as: 'twits',
            //                 attributes: ['username', 'email', 'imageUrl']
            //         },
            //         { model: Comments, as: 'comments',
            //             include: [
            //                 { model: Users, as: 'usercomments',
            //                     attributes: ['username', 'email', 'imageUrl']
            //                 },
            //                 { model: LikeComments, as: 'likecomments',
            //                     // attributes: ['username', 'email', 'imageUrl']
            //                 }
            //             ]
            //         },
            //         { model: Likes, as: 'likes',
            //             include: [
            //                 { model: Users, as: 'userlikes',
            //                 attributes: ['username', 'email', 'imageUrl']
            //             }
            //             ]
            //         }
            //     ]
            //     });

            // client.set('twits', JSON.stringify(twits));
            // client.quit();

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

            // const twits = await Twits.findAll({ 
            //     where: { 
            //             isDeleted: false
            //         },
            //     include: [
            //         { model: Users, as: 'twits',
            //                 attributes: ['username', 'email', 'imageUrl']
            //         },
            //         { model: Comments, as: 'comments',
            //             include: [
            //                 { model: Users, as: 'usercomments',
            //                     attributes: ['username', 'email', 'imageUrl']
            //                 },
            //                 { model: LikeComments, as: 'likecomments',
            //                     // attributes: ['username', 'email', 'imageUrl']
            //                 }
            //             ]
            //         },
            //         { model: Likes, as: 'likes',
            //             include: [
            //                 { model: Users, as: 'userlikes',
            //                 attributes: ['username', 'email', 'imageUrl']
            //             }
            //             ]
            //         }
            //     ]
            //     });

            // client.set('twits', JSON.stringify(twits));
            // client.quit();

            response(res, 200, updatedTwit, null, 'Twit deleted');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in deleting twit');
        }
}; 
