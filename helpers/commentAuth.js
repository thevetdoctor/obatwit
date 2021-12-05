const Users = require('../models').user;
const Comments = require('../models').comment;
const { response } = require('oba-http-response');

module.exports = async(req, res, next) => {

    const { userId } = req.body;
     if(userId) {
        try {
            const comment = await Comments.findByPk( req.params.commentId,
                {
                    attributes: ['id', 'userId'],
                    raw: true,
                }
            );
         if(userId !== comment.userId) {
            return response(res, 403, null, 'Only the author can perform this action');
         }
         next();
        }catch(error) {
            response(res, 500, null, error.message, 'Error in verifying ownership');
        }
    } else {
        return response(res, 403, null, 'Auth forbidden');
    }

}