const express = require('express');
const router = express.Router();
const LikeCommentController = require('../controllers/LikeCommentController');
const checkAuth = require('../helpers/auth');

router.post('/like/:commentId', checkAuth, LikeCommentController.likeComment);

module.exports = router;