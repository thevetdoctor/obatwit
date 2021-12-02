const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/signup', AuthController.signUp);
router.post('/login', AuthController.logIn);
router.get('/users', AuthController.getUsers);

module.exports = router;