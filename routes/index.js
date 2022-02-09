const AuthRoutes = require('./AuthRoutes');
const TwitRoutes = require('./TwitRoutes');
const CommentRoutes = require('./CommentRoutes');
const LikeRoutes = require('./LikeRoutes');
const LikeCommentRoutes = require('./LikeCommentRoutes');
const FollowerRoutes = require('./FollowerRoutes');
const MessageRoutes = require('./MessageRoutes');
const PushRoutes = require('./PushRoutes');
const Push = require('../models').push;
const express = require('express');
const router = express.Router();
const { response } = require('oba-http-response');

const SubRoute = router.post('/', async(req, res) => {
    try {
        const pushExist = await Push.findOne({
            where: {
                text: JSON.stringify(req.body.sub)
            }
        }, {
        attributes: ['id', 'userId', 'text']
        });
        console.log(pushExist ? 'exist' : 'not found');
        if(!pushExist) {
            await Push.create({text: JSON.stringify(req.body.sub), userId: req.body.id});
        } else {
            if(!pushExist.userId) await Push.update({userId: req.body.id}, {where: {text: pushExist.text}});
        }
        res.status(200).json({success: true, message: pushExist ? 'Already Subscribed' : 'Pushed'});
    }catch(error) {
        response(res, 500, null, error.message, 'Error in upadting push');
}
});


module.exports = (app) => {
    app.use('/auth', AuthRoutes);
    app.use('/twits', TwitRoutes);
    app.use('/comments', CommentRoutes);
    app.use('/likes', LikeRoutes);
    app.use('/likecomments', LikeCommentRoutes);
    app.use('/followers', FollowerRoutes);
    app.use('/messages', MessageRoutes);
    app.use('/checksub', SubRoute);
    app.use('/push', PushRoutes);
}