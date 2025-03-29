



// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["https://wsocket.vercel.app", "http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
// });

// const SECRET_KEY = process.env.SECRET_KEY || "secret_key"; // Use env for security
// const PORT = process.env.PORT || 4000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => {
//     console.error('MongoDB Connection Error:', err);
//     process.exit(1); // Exit on failure
//   });

// // Schemas
// const userSchema = new mongoose.Schema({
//   username: { type: String, unique: true, required: true, index: true },
//   password: { type: String, required: true },
//   created_at: { type: Date, default: Date.now },
// });
// const User = mongoose.model('User', userSchema);

// const friendRequestSchema = new mongoose.Schema({
//   sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
//   receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
//   status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
//   created_at: { type: Date, default: Date.now },
// });
// const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

// const messageSchema = new mongoose.Schema({
//   sender_id: { type: String, required: true },
//   receiver_id: { type: String, required: true },
//   text: { type: String, required: true },
//   created_at: { type: Date, default: Date.now },
// });
// const Message = mongoose.model('Message', messageSchema);

// // Middleware for JWT Authentication
// const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.userId = decoded.id;
//     next();
//   } catch (err) {
//     res.status(403).json({ message: 'Invalid token' });
//   }
// };


// // User Registration
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     if (err.code === 11000) return res.status(400).json({ message: 'Username already exists' });
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // User Login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

//   try {
//     const user = await User.findOne({ username });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
//     res.json({ token, username, userId: user._id });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Fetch All Users
// app.get('/users', authenticateToken, async (req, res) => {
//   try {
//     const users = await User.find({ _id: { $ne: req.userId } }, 'username');
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// });




// // Send Friend Request
// app.post('/send-request', authenticateToken, async (req, res) => {
//   const { receiverId } = req.body;
//   const senderId = req.userId;

//   if (!receiverId) return res.status(400).json({ message: 'Receiver ID required' });

//   try {
//     const existingRequest = await FriendRequest.findOne({
//       $or: [
//         { sender_id: senderId, receiver_id: receiverId },
//         { sender_id: receiverId, receiver_id: senderId },
//       ],
//     });

//     if (existingRequest) {
//       if (existingRequest.status === 'pending') return res.status(400).json({ message: 'Friend request already pending' });
//       if (existingRequest.status === 'accepted') return res.status(400).json({ message: 'You are already friends' });
//     }

//     const friendRequest = new FriendRequest({ sender_id: senderId, receiver_id: receiverId });
//     await friendRequest.save();
//     res.status(201).json({ message: 'Friend request sent successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error sending friend request' });
//   }
// });

// // Accept/Decline Friend Request
// const updateRequestStatus = async (req, res, status) => {
//   const { requestId } = req.body;
//   if (!requestId) return res.status(400).json({ message: 'Request ID required' });

//   try {
//     const result = await FriendRequest.updateOne({ _id: requestId }, { status });
//     if (result.nModified === 0) return res.status(404).json({ message: 'Request not found' });
//     res.json({ message: `Friend request ${status}` });
//   } catch (err) {
//     res.status(500).json({ message: `Error ${status === 'accepted' ? 'accepting' : 'declining'} request` });
//   }
// };
// app.post('/accept-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'accepted'));
// app.post('/decline-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'declined'));

// // Fetch Friend Requests
// app.get('/friend-requests/:userId', authenticateToken, async (req, res) => {
//   const { userId } = req.params;
//   if (req.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

//   try {
//     const requests = await FriendRequest.find({ receiver_id: userId, status: 'pending' })
//       .populate('sender_id', 'username');
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching friend requests' });
//   }
// });

// // Fetch Accepted Friends
// app.get('/friends/:userId', authenticateToken, async (req, res) => {
//   const { userId } = req.params;
//   if (req.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

//   try {
//     const friends = await FriendRequest.find({
//       $or: [{ sender_id: userId }, { receiver_id: userId }],
//       status: 'accepted',
//     })
//       .populate('sender_id', 'username')
//       .populate('receiver_id', 'username');

//     const friendList = friends.map(f => 
//       f.sender_id._id.toString() === userId ? f.receiver_id : f.sender_id
//     );
//     res.json(friendList);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching friends' });
//   }
// });

// // Fetch Messages
// app.get('/messages/:friendId', authenticateToken, async (req, res) => {
//   const { friendId } = req.params;
//   const userId = req.userId;

//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender_id: userId, receiver_id: friendId },
//         { sender_id: friendId, receiver_id: userId },
//       ],
//     }).sort({ created_at: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching messages' });
//   }
// });

// // Socket.IO Logic
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined their room`);
//   });

//   socket.on('chat message', async (msg) => { // Raw data accept chey
//     console.log('Received raw msg:', msg); // Debug log
//     try {
//       const { sender_id, receiver_id, text } = msg; // Destructure from raw msg
//       if (!sender_id || !receiver_id) {
//         throw new Error('Missing sender_id or receiver_id');
//       }
//       const message = new Message({ sender_id, receiver_id, text });
//       await message.save();
//       io.to(receiver_id).to(sender_id).emit('chat message', {
//         sender_id,
//         receiver_id,
//         text,
//         created_at: message.created_at,
//       });
//     } catch (err) {
//       console.errorprix('Error storing message:', err);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });
// // Start Server
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });









const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');
const messageRoutes = require('./routes/messages');
const setupSocket = require('./socket/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://wsocket.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', friendRoutes); // Friend routes under /api
app.use('/api', messageRoutes); // Message routes under /api

// Socket.IO Setup
setupSocket(io);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});