const express = require('express');
const router = express.Router();
const TwitController = require('../controllers/TwitController');
const checkAuth = require('../helpers/auth');
const userAuth = require('../helpers/userAuth');

router.post('/post', checkAuth, TwitController.postTwit);
router.get('/', checkAuth, TwitController.getTwits);
router.get('/:twitId', checkAuth, TwitController.getTwit);
router.patch('/:twitId', checkAuth, userAuth, TwitController.updateTwit);
router.delete('/:twitId', checkAuth, userAuth, TwitController.deleteTwit);

module.exports = router;