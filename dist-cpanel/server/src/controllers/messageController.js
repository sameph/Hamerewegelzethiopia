const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
    try {
        req.body.sender = req.user.id;

        // Verify recipient if private message
        if (req.body.recipient) {
            const recipient = await User.findById(req.body.recipient);
            if (!recipient) {
                return res.status(404).json({ success: false, message: 'Recipient not found' });
            }
        }

        const message = await Message.create(req.body);

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get messages for a conversation or group
// @route   GET /api/v1/messages
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const { recipient, group } = req.query;
        let query = {};

        if (group) {
            query.group = group;
        } else if (recipient) {
            // Private conversation: sender is me and recipient is them, OR vice versa
            query = {
                $or: [
                    { sender: req.user.id, recipient: recipient },
                    { sender: recipient, recipient: req.user.id }
                ]
            };
        } else {
            return res.status(400).json({ success: false, message: 'Please provide a recipient or group' });
        }

        const messages = await Message.find(query)
            .populate('sender', 'username profileImage')
            .sort('createdAt');

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get conversation list
// @route   GET /api/v1/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
    try {
        // Find all unique users I've chatted with
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        }).populate('sender recipient', 'username profileImage');

        const users = new Map();
        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === req.user.id ? msg.recipient : msg.sender;
            if (otherUser) {
                users.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg.content,
                    lastMessageAt: msg.createdAt
                });
            }
        });

        res.status(200).json({
            success: true,
            data: Array.from(users.values())
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
