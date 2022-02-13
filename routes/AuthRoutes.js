const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const checkAuth = require('../helpers/auth');

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.get('/users', checkAuth, AuthController.getUsers);
router.get('/users/:username', AuthController.getUserProfile);
router.get('/verify/:username', AuthController.verifyUser);
router.post('/verify/all', AuthController.verifyUsers);
router.get('/emails', checkAuth, AuthController.getAllUserEmails);
router.patch('/update', checkAuth, AuthController.updateUserInfo);
router.patch('/imageurl/update', checkAuth, AuthController.updateUserImage);

module.exports = router;