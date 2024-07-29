const express = require('express');
const { isAuthenticatedUser } = require('../middleware/Auth');
const { createChat, getChatList, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.route('/chat').post(isAuthenticatedUser, createChat);

// router.route('/send-message').post(isAuthenticatedUser, sendMessage);

router.route('/chat-list').get(isAuthenticatedUser, getChatList);

router.route('/chats/:chatId/messages').get(isAuthenticatedUser, getChatHistory);


module.exports = router;
