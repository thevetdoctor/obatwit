const express = require('express');
const router = express.Router();
const TwitController = require('../controllers/TwitController');
const checkAuth = require('../helpers/auth');
const userAuth = require('../helpers/userAuth');

router.post('/post', TwitController.postTwit);
router.get('/', TwitController.getTwits);
router.get('/:twitId', checkAuth, userAuth, TwitController.getTwit);
router.patch('/:twitId', TwitController.updateTwit);
router.delete('/:twitId', TwitController.deleteTwit);

module.exports = router;