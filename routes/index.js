const AuthRoutes = require('./AuthRoutes');
const TwitRoutes = require('./TwitRoutes');
const CommentRoutes = require('./CommentRoutes');
const LikeRoutes = require('./LikeRoutes');
const LikeCommentRoutes = require('./LikeCommentRoutes');
const FollowerRoutes = require('./FollowerRoutes');
const MessageRoutes = require('./MessageRoutes');

module.exports = (app) => {
    app.use('/auth', AuthRoutes);
    app.use('/twits', TwitRoutes);
    app.use('/comments', CommentRoutes);
    app.use('/likes', LikeRoutes);
    app.use('/likecomments', LikeCommentRoutes);
    app.use('/followers', FollowerRoutes);
    app.use('/messages', MessageRoutes);
}