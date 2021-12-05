const Sequelize = require("sequelize");
const Users = require('../models').user;
const Twits = require('../models').twit;
const Comments = require('../models').comment;
const LikeComments = require('../models').likecomment;
const { response } = require('oba-http-response');

exports.postComment = async(req, res) => {
    const { twitId } = req.params;
    const { text, userId } = req.body;
    if(!(twitId && text && userId)) return response(res, 400, null, 'Please supply missing input(s)');
    try {
        const twitExist = await Twits.findOne({ 
            where: {
                id: twitId,
                isDeleted: false
            },
            raw: true
        });
        if(!twitExist) return response(res, 400, null, 'Twit not found');

        const commentExist = await Comments.findOne({ where: {
            text,
            twitId,
            userId,
            isDeleted: false
        }});
        if(commentExist) return response(res, 400, null, 'Comment already sent');

        const newComment = await Comments.create({ text, twitId, userId });
        response(res, 201, newComment, null, 'Comment sent successfully');
    }catch(error) {
        response(res, 500, null, error.message, 'Error in sending comment');
    }
};


exports.deleteComment = async(req, res) => {
    const { commentId } = req.params;
    if(!commentId) return response(res, 400, null, 'Please supply missing input(s)');

      try {
            const comment = await Comments.findOne({ 
                where: { 
                        id: commentId,
                        isDeleted: false
                    }
                }, {
                include: [
                    { model: LikeComments, as: 'likecomments' }
                ]
            });
            if(!comment) return response(res, 400, null, 'Comment not found');
            await Comments.update({ isDeleted: true }, { where: { id: commentId }});
            
            const updatedComment = await Comments.findByPk(commentId, {
                where: {
                    isDeleted: false
                }
            });
            response(res, 200, updatedComment, null, 'Comment deleted');
        }catch(error) {
            response(res, 500, null, error.message, 'Error in deleting comment');
        }
}; 

