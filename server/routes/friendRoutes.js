const express = require("express");
const FriendRequest = require("../models/FriendRequest");
const router = express.Router();
const { io } = require("../server"); // Import io from server.js

router.post("/send-request", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const request = new FriendRequest({ senderId, receiverId });
    await request.save();

    // Emit notification for real-time friend request
    io.emit("friendRequestReceived", { senderId, receiverId });

    res.status(201).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/accept-request", async (req, res) => {
  try {
    const { requestId } = req.body;
    await FriendRequest.findByIdAndUpdate(requestId, { status: "accepted" });

    io.emit("friendRequestAccepted", { requestId });

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/decline-request", async (req, res) => {
  try {
    const { requestId } = req.body;
    await FriendRequest.findByIdAndUpdate(requestId, { status: "denied" });

    io.emit("friendRequestDeclined", { requestId });

    res.json({ message: "Friend request declined" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
