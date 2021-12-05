const AuthRoutes = require('./AuthRoutes');
const TwitRoutes = require('./TwitRoutes');
const CommentRoutes = require('./CommentRoutes');
const LikeRoutes = require('./LikeRoutes');
const LikeCommentRoutes = require('./LikeCommentRoutes');

module.exports = (app) => {
    app.use('/auth', AuthRoutes);
    app.use('/twits', TwitRoutes);
    app.use('/comments', CommentRoutes);
    app.use('/likes', LikeRoutes);
    app.use('/likecomments', LikeCommentRoutes);
}