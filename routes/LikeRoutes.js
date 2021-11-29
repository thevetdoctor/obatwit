const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/LikeControlller');

router.post('/like/:twitId', LikeController.likeTwit);

module.exports = router;