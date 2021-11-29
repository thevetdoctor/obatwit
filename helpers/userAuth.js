const Users = require('../models').user;
const { response } = require('oba-http-response');

module.exports = async(req, res, next) => {

    const { userId } = req;

     if(userId) {
        try {
            const user = await Users.findByPk( userId,
                {
                    attributes: ["id"],
                    raw: true,
                }
            );
            if(!user) {
                const newUser = await Users.create({email: req.userEmail}, {
                    raw: true,
                });
                // console.log('req new userID: ', newUser);
                req.body.userId = newUser['id'];
                next();
            } else {
            // console.log('req userID: ', user);
            req.body.userId = user['id'];
            next();
            }
        }catch(error) {
            if(error.message.search('Validation') >= 0) {
                return response(res, 400, null, 'Email not valid');
            }
            response(res, 500, null, error.message, 'Error in getting userId');
        }
    } else {
        return response(res, 403, null, 'Auth forbidden');
    }

}