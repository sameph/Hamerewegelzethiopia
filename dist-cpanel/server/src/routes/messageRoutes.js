const express = require('express');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/', getMessages);
router.get('/conversations', getConversations);

module.exports = router;
