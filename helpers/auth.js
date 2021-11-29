const { config } = require('dotenv');
const jwt = require('jsonwebtoken');
const { response } = require('oba-http-response');
config();

const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if(req.body.userId) {
        next()
    } else if(typeof authorization !== 'undefined') {
        req.token = authorization.split(' ')[1];

        jwt.verify(req.token, JWT_SECRET, (error, auth) => {
            if(error) {
                console.log(error.message, JWT_SECRET)
                return response(res, 403, null, 'Auth Failed');
            }
            if(auth) {
                req.userId = auth.user.id;
                console.log(auth)
            }
            next();
        });
    } else {
        return response(res, 403, null, 'Access forbidden');
    }
}

module.exports = verifyToken;