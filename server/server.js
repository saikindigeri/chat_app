
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const mysql = require('mysql2');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);
//  const io = new Server(server, {
//   cors: {
//     origin: ["https://wsocket.vercel.app", "http://localhost:3000"],
//     methods: ["GET", "POST"],
//   },
//  });

// const SECRET_KEY = "secret_key"; 
// const PORT = process.env.PORT || 4000;
// // Middleware
// app.use(cors());
// app.use(express.json());
 
// require('dotenv').config();
// // Database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD, 
//   database: process.env.DB_NAME,
// });  
 
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database:', err);
//     process.exit(1);
//   }
//   console.log('Connected to MySQL database');

//   // Create tables if they don't exist
//   const createUsersTable = `
//     CREATE TABLE IF NOT EXISTS users (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       username VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;

//   const createFriendRequestsTable = `
//     CREATE TABLE IF NOT EXISTS friend_requests (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       sender_id INT NOT NULL,
//       receiver_id INT NOT NULL,
//       status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
//       FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
//     )
//   `;

//   const createMessagesTable = `
//     CREATE TABLE IF NOT EXISTS messages (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       sender_id INT NOT NULL,
//       receiver_id INT NOT NULL,
//       text TEXT NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
//       FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
//     )
//   `;

//   db.query(createUsersTable, (err) => {
//     if (err) {
//       console.error('Error creating users table:', err);
//     } else {
//       console.log('Users table created or already exists');
//     }
//   });

//   db.query(createFriendRequestsTable, (err) => {
//     if (err) {
//       console.error('Error creating friend_requests table:', err);
//     } else {
//       console.log('FriendRequests table created or already exists');
//     }
//   });

//   db.query(createMessagesTable, (err) => {
//     if (err) {
//       console.error('Error creating messages table:', err);
//     } else {
//       console.log('Messages table created or already exists');
//     }
//   });
// });
// // User registration
// app.post('/register', (req, res) => {
//   const { username, password } = req.body;
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) return res.status(500).json({ message: 'Error hashing password' });
//     db.query(
//       'INSERT INTO users (username, password) VALUES (?, ?)',
//       [username, hashedPassword],
//       (err) => {
//         if (err) return res.status(400).json({ message: 'User already exists' });
//         res.json({ message: 'User registered successfully' });
//       }
//     );
//   });
// });

// // User login
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
//     if (err || results.length === 0)
//       return res.status(401).json({ message: 'Invalid credentials' });
 
//     const user = results[0];
//     const userId=user.id
//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
//       const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

//       res.json({ token, username, userId});
//     });
//   });
// }); 
 
// // Fetch all registered users
// app.get('/users', (req, res) => {
//   const token = req.headers.authorization; 
//   const decoded = jwt.verify(token, SECRET_KEY);
//   const currentUserId = decoded.id;
 
//   db.query(
//     'SELECT id, username FROM users WHERE id != ?',
//     [currentUserId],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error fetching users' });
//       }
//       res.json(results);
//     }
//   );
// });



// app.post('/send-request', (req, res) => {
//   const { senderId, receiverId } = req.body;

//   if (!senderId || !receiverId) {
//     return res.status(400).json({ message: 'Sender ID and Receiver ID are required.' });
//   }

//   // Check if a pending or accepted request already exists
//   const checkQuery = `
//     SELECT * 
//     FROM friend_requests 
//     WHERE 
//       (sender_id = ? AND receiver_id = ?) 
//       OR 
//       (sender_id = ? AND receiver_id = ?)
//   `;

//   db.query(checkQuery, [senderId, receiverId, receiverId, senderId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error checking existing requests.' });
//     }

//     // If a request or friendship already exists, prevent sending a new one
//     if (results.length > 0) {
//       const existingRequest = results[0];
//       if (existingRequest.status === 'pending') {
//         return res.status(400).json({ message: 'Friend request is already pending.' });
//       }
//       if (existingRequest.status === 'accepted') {
//         return res.status(400).json({ message: 'You are already friends.' });
//       }
//     }

//     // Insert a new friend request
//     const insertQuery = `
//       INSERT INTO friend_requests (sender_id, receiver_id, status) 
//       VALUES (?, ?, 'pending')
//     `;

//     db.query(insertQuery, [senderId, receiverId], (insertErr) => {
//       if (insertErr) {
//         return res.status(500).json({ message: 'Error sending friend request.' });
//       }
//       res.json({ message: 'Friend request sent successfully.' });
//     });
//   });
// });



// // Accept friend request
// app.post('/accept-request', (req, res) => {
//   const { requestId } = req.body;
//   db.query(
//     'UPDATE friend_requests SET status = "accepted" WHERE id = ?',
//     [requestId],
//     (err) => {
//       if (err) return res.status(500).json({ message: 'Error accepting request' });
//       res.json({ message: 'Friend request accepted' });
//     }
//   );
// });

// // Decline friend request
// app.post('/decline-request', (req, res) => {
//   const { requestId } = req.body;
//   db.query(
//     'UPDATE friend_requests SET status = "declined" WHERE id = ?',
//     [requestId],
//     (err) => {
//       if (err) return res.status(500).json({ message: 'Error declining request' });
//       res.json({ message: 'Friend request declined' });
//     }
//   );
// });



// app.get('/friend-requests/:userId', (req, res) => {
//   const { userId } = req.params;

//   // Query to join friend_requests and users tables
//   db.query(
//     `
//     SELECT 
//       friend_requests.id AS request_id,
//       friend_requests.sender_id,
//       friend_requests.receiver_id,
//       friend_requests.status,
//       users.username AS username
//     FROM friend_requests
//     JOIN users ON friend_requests.sender_id = users.id
//     WHERE friend_requests.receiver_id = ? AND friend_requests.status = 'pending'
//     `,
//     [userId],
//     (err, results) => {
//       if (err) {
//         console.error(err); // Log the error for debugging
//         return res.status(500).json({ message: 'Error fetching friend requests' });
//       }

//       res.json(results);
//     }
//   );
// });


// // Fetch accepted friends
// app.get('/friends/:userId', (req, res) => {
//   const { userId } = req.params;
//   db.query(
//     `SELECT users.id, users.username FROM friend_requests 
//      JOIN users ON users.id = friend_requests.sender_id OR users.id = friend_requests.receiver_id
//      WHERE (sender_id = ? OR receiver_id = ?) AND status = "accepted" AND users.id != ?`,
//     [userId, userId, userId],
//     (err, results) => {
//       if (err) return res.status(500).json({ message: 'Error fetching friends' });
//       res.json(results);
//     }
//   );
// });



// app.get('/pending-requests/:userId', (req, res) => {
//   const userId = req.params.userId;

//   // Query to fetch pending requests where the user is the receiver
//   const query = `
//     SELECT fr.id AS requestId, u.id AS senderId, u.username AS senderUsername 
//     FROM friend_requests fr
//     JOIN users u ON fr.sender_id = u.id
//     WHERE fr.receiver_id = ? AND fr.status = 'pending';
//   `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error('Error fetching pending requests:', err);
//       return res.status(500).json({ error: 'Failed to fetch pending requests.' });
//     }

//     res.json(results); // Send pending requests as JSON response
//   });
// });

// io.on('connection', (socket) => {
  

//   // Join user-specific room on connection

//   // Listen for chat messages
//   socket.on('chat message', ({ senderId, receiverId, text }) => {
//     const now = new Date();
//     const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')

//     // Insert the message into the database
//     db.query(
//       'INSERT INTO messages (sender_id, receiver_id, text, created_at) VALUES (?, ?, ?, ?)',
//       [senderId, receiverId, text, formattedDate],
//       (err) => {
//         if (err) {
//           console.error('Error storing message:', err);
//           return;
//         }

//         // Emit the message only to the sender and receiver
//         io.to(senderId).to(receiverId).emit('chat message', {
//           senderId,
//           receiverId,
//           text,
//           formattedDate,
//         });
//       }
//     );
//   });

//   // Handle user disconnection
 
// });


// // Fetch messages between the logged-in user and selected friend
// app.get('/messages/:friendId', (req, res) => {

//   const { friendId } = req.params;
//   const token = req.headers.authorization.split(" ")[1]; // Get token from request headers
//   const decoded = jwt.verify(token, SECRET_KEY);
//   const userId = decoded.id;
//   if (!friendId) {
//     return res.status(400).json({ error: 'Friend ID is required' });
//   }

//   // Query to fetch messages between the logged-in user and the friend
//   db.query(
//     `SELECT * FROM messages 
//     WHERE (sender_id = ? AND receiver_id = ?) 
//        OR (sender_id = ? AND receiver_id = ?)
//     ORDER BY created_at ASC`,
//     [userId, friendId, friendId, userId],
//     (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error fetching messages' });
//       }
//       res.json(results); // Return the messages in the response
//     }
//   );
// });

 
// // Start server
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });






const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://wsocket.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const SECRET_KEY = process.env.SECRET_KEY || "secret_key"; // Use env for security
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit on failure
  });

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const friendRequestSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

const messageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Username already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch All Users
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }, 'username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Send Friend Request
app.post('/send-request', authenticateToken, async (req, res) => {
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
app.post('/accept-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'accepted'));
app.post('/decline-request', authenticateToken, (req, res) => updateRequestStatus(req, res, 'declined'));

// Fetch Friend Requests
app.get('/friend-requests/:userId', authenticateToken, async (req, res) => {
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
app.get('/friends/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  if (req.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

  try {
    const friends = await FriendRequest.find({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
      status: 'accepted',
    })
      .populate('sender_id', 'username')
      .populate('receiver_id', 'username');

    const friendList = friends.map(f => 
      f.sender_id._id.toString() === userId ? f.receiver_id : f.sender_id
    );
    res.json(friendList);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
});

// Fetch Messages
app.get('/messages/:friendId', authenticateToken, async (req, res) => {
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

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('chat message', async (msg) => { // Raw data accept chey
    console.log('Received raw msg:', msg); // Debug log
    try {
      const { sender_id, receiver_id, text } = msg; // Destructure from raw msg
      if (!sender_id || !receiver_id) {
        throw new Error('Missing sender_id or receiver_id');
      }
      const message = new Message({ sender_id, receiver_id, text });
      await message.save();
      io.to(receiver_id).to(sender_id).emit('chat message', {
        sender_id,
        receiver_id,
        text,
        created_at: message.created_at,
      });
    } catch (err) {
      console.errorprix('Error storing message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});