const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/LikeControlller');
const checkAuth = require('../helpers/auth');

router.post('/like/:twitId', checkAuth, LikeController.likeTwit);

module.exports = router;