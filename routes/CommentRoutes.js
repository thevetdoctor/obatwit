const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

router.post('/:twitId', CommentController.postComment);

module.exports = router;