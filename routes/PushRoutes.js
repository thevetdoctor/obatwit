const express = require('express');
const router = express.Router();
const PushController = require('../controllers/PushController');

router.get('/', PushController.pushCheck);

module.exports = router;