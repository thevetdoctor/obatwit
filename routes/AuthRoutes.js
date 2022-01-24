const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const checkAuth = require('../helpers/auth');

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.get('/users', AuthController.getUsers);
router.get('/users/:username', AuthController.getUserProfile);
router.get('/verify/:username', AuthController.verifyUser);
router.post('/verify/all', AuthController.verifyUsers);
router.get('/emails', AuthController.getAllUserEmails);
router.patch('/update', checkAuth, AuthController.updateUserInfo);

module.exports = router;