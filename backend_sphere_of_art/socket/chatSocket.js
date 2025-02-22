// socket/chatSocket.js
import Chat from '../app/models/Chat.js'; // Adjust the path as needed

// Object to store connected users: key = userId, value = socket.id
const users = {};

// Initialize chat functionality
const initChat = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // When a user joins, store their userId with the socket id
    socket.on('join', (userId) => {
      users[userId] = socket.id;
      console.log(`User ${userId} joined with socket id: ${socket.id}`);
    });

    // When a message is sent, save it and forward it to the receiver if online
    socket.on('sendMessage', async ({ orderId, senderId, receiverId, message }) => {
      console.log('Received message:', message);

      // Create a new chat document
      const chat = new Chat({ orderId, senderId, receiverId, message });
      try {
        await chat.save();
      } catch (error) {
        console.error('Error saving chat:', error);
        return;
      }

      // Emit message to receiver if they're connected
      if (users[receiverId]) {
        io.to(users[receiverId]).emit('receiveMessage', chat);
      }
    });

    // On disconnect, remove the user from the users object
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      Object.keys(users).forEach((userId) => {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      });
    });
  });
};

export default initChat;
