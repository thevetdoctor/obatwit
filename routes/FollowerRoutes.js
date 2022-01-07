const express = require('express');
const router = express.Router();
const FollowerController = require('../controllers/FollowerController');
const checkAuth = require('../helpers/auth');
const userAuth = require('../helpers/userAuth');

router.post('/follow', checkAuth, FollowerController.followUser);
router.get('/followers', checkAuth, FollowerController.getFollowers);
router.get('/following', checkAuth, FollowerController.getFollowing);
router.patch('/unfollow', checkAuth, FollowerController.updateFollowingStatus);

module.exports = router;