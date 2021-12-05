const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const checkAuth = require('../helpers/auth');
const commentAuth = require('../helpers/commentAuth');

router.post('/:twitId', checkAuth, CommentController.postComment);
router.delete('/:commentId', checkAuth, commentAuth, CommentController.deleteComment);

module.exports = router;