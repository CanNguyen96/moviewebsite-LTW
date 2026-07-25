const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Router endpoint POST /chatbot/chat
router.post('/chatbot/chat', chatbotController.handleChat);

module.exports = router;
