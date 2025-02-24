import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Chat = ({ orderId, userId, receiverId }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Join the chat
    socket.emit('join', userId);

    // Receive messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, userId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const msgData = { orderId, senderId: userId, receiverId, message };
    socket.emit('sendMessage', msgData);

    setMessages((prev) => [...prev, msgData]);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === userId ? 'sent' : 'received'}>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
