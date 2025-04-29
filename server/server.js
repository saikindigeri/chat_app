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
app.use(cors({
  origin: "https://chat-app.ksai.live", // or "*" for all origins (not recommended for production)
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://chat-app.ksai.live', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const PORT = process.env.PORT || 4000;

// Middleware

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