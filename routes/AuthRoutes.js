const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.get('/users', AuthController.getUsers);
router.get('/users/:username', AuthController.getUserProfile);
router.get('/verify/:username', AuthController.verifyUser);
router.post('/verify/all', AuthController.verifyUsers);
router.get('/emails', AuthController.getAllUserEmails);

module.exports = router;