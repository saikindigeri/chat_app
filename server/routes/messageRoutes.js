const express = require("express");
const Message = require("../models/Message");
const router = express.Router();
const { io } = require("../server"); // Import io from server.js

router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const message = new Message({ senderId, receiverId, text });
    await message.save();

    // Emit real-time message via Socket.io
    io.emit("newMessage", { senderId, receiverId, text });

    res.status(201).json({ message: "Message sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:user1/:user2", async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.user1, receiverId: req.params.user2 },
        { senderId: req.params.user2, receiverId: req.params.user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
