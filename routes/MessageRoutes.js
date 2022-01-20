const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');
const checkAuth = require('../helpers/auth');
const messageAuth = require('../helpers/messageAuth');

router.post('/post', checkAuth, MessageController.sendMessage);
router.get('/chats', checkAuth, MessageController.getAllChats);
router.get('/chat/:receiverId', checkAuth, MessageController.getChat);
router.patch('/:messageId', checkAuth, messageAuth, MessageController.updateMessage);
router.delete('/:messageId', checkAuth, messageAuth, MessageController.deleteMessage);
router.delete('/chat/:receiverId', checkAuth, MessageController.deleteChat);

module.exports = router;