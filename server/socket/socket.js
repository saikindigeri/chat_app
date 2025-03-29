const Message = require('../models/Message');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('chat message', async (msg) => {
      console.log('Received raw msg:', msg);
      try {
        const { sender_id, receiver_id, text } = msg;
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
        console.error('Error storing message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;