const AuthRoutes = require('./AuthRoutes');
const TwitRoutes = require('./TwitRoutes');
const CommentRoutes = require('./CommentRoutes');
const LikeRoutes = require('./LikeRoutes');
const LikeCommentRoutes = require('./LikeCommentRoutes');
const FollowerRoutes = require('./FollowerRoutes');
const MessageRoutes = require('./MessageRoutes');
const Push = require('../models').push;
const express = require('express');
const router = express.Router();

const SubRoute = router.post('/', async(req, res) => {
    console.log('sub route', req.body);

    const pushExist = await Push.findOne({where: {text: JSON.stringify(req.body.sub)}}, {
        attributes: ['id', 'userId', 'text']
    });
    if(!pushExist) await Push.create({text: req.body.sub, userId: req.body.id});
    if(!pushExist.userId) await Push.update({userId: req.body.id}, {where: {text: pushExist.text}});
    console.log(pushExist);

    res.status(200).json({success: true, message: pushExist ? 'Subscribed' : 'Pushed'});
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
}