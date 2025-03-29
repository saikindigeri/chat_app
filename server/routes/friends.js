const express = require('express');
const FriendRequest = require('../models/FriendRequest');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Send Friend Request
router.post('/send-request', authenticateToken, async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.userId;

  if (!receiverId) return res.status(400).json({ message: 'Receiver ID required' });

  try {
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') return res.status(400).json({ message: 'Friend request already pending' });
      if (existingRequest.status === 'accepted') return res.status(400).json({ message: 'You are already friends' });
    }

    const friendRequest = new FriendRequest({ sender_id: senderId, receiver_id: receiverId });
    await friendRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

// Accept/Decline Friend Request
const updateRequestStatus = async (req, res, status) => {
  const { requestId } = req.body;
  if (!requestId) return res.status(400).json({ message: 'Request ID required' });

  try {
    const result = await FriendRequest.updateOne({ _id: requestId }, { status });
    if (result.nModified === 0) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: `Friend request ${status}` });
  } catch (err) {
    res.status(500).json({ message: `Error ${status === 'accepted' ? 'accepting' : 'declining'} request` });
  }
};

router.post('/accept-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'accepted'));
router.post('/decline-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'declined'));

// Fetch Friend Requests
router.get('/friend-requests/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

  try {
    const requests = await FriendRequest.find({ receiver_id: userId, status: 'pending' })
      .populate('sender_id', 'username');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching friend requests' });
  }
});

// Fetch Accepted Friends
router.get('/friends/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    console.log('UserId from params:', userId);
    console.log('UserId from token:', req.userId);
  
    if (req.userId.toString() !== userId) {
      console.log('Unauthorized: IDs do not match');
      return res.status(403).json({ message: 'Unauthorized' });
    }
  
    try {
      console.log('Querying FriendRequest...');
      const friends = await FriendRequest.find({
        $or: [{ sender_id: userId }, { receiver_id: userId }],
        status: 'accepted',
      })
        .populate('sender_id', 'username')
        .populate('receiver_id', 'username');
  
      console.log('Raw friends from DB:', friends);
  
      const friendList = friends.map(f => 
        f.sender_id._id.toString() === userId ? f.receiver_id : f.sender_id
      );
      console.log('Mapped friendList:', friendList);
      res.json(friendList);
    } catch (err) {
      console.error('Error fetching friends:', err.stack); // Full stack trace
      res.status(500).json({ message: 'Error fetching friends', error: err.message });
    }
  });



  
module.exports = router;