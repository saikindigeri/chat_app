const express = require('express');
const Message = require('../models/Message');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Fetch Messages
router.get('/messages/:friendId', authenticateToken, async (req, res) => {
  const { friendId } = req.params;
  const userId = req.userId;

  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: friendId },
        { sender_id: friendId, receiver_id: userId },
      ],
    }).sort({ created_at: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;