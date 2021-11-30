const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const checkAuth = require('../helpers/auth');

router.post('/:twitId', checkAuth, CommentController.postComment);

module.exports = router;