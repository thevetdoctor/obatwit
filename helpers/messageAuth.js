const Users = require('../models').user;
const Messages = require('../models').message;
const { response } = require('oba-http-response');

module.exports = async(req, res, next) => {

    const { userId } = req.body;
     if(userId) {
        try {
            const message = await Messages.findByPk( req.params.messageId,
                {
                    attributes: ['id', 'senderId'],
                    raw: true,
                }
            );
         if(userId !== message.senderId) {
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