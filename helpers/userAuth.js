const Users = require('../models').user;
const Twits = require('../models').twit;
const { response } = require('oba-http-response');

module.exports = async(req, res, next) => {

    const { userId } = req.body;
     if(userId) {
        try {
            const twit = await Twits.findByPk( req.params.twitId,
                {
                    attributes: ['id', 'userId'],
                    raw: true,
                }
            );
        //  console.log(userId, twit.userId)
         if(userId !== twit.userId) {
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