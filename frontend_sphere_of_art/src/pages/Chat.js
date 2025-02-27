import React, { useState, useEffect, useRef, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import AuthContext from "../context/Auth.js";
import { motion } from "framer-motion"; // For animations
import { format } from "date-fns"; // For timestamps

const Chat = () => {
  const { orderId, artistId, customerId } = useParams();
  const socket = useSocket();
  const { userState } = useContext(AuthContext);
  const user = userState.user; // Logged-in user

  // Determine the other party's ID
  const otherPartyId = user.role === "customer" ? artistId : customerId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket || !orderId || !user) return;

    // Join chat room based on orderId
    socket.emit("join", { userId: user.id, orderId });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4800/api/chats/${orderId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setMessages(response.data); // ✅ Messages now include `createdAt`
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => {
        // Prevent duplicate messages
        if (prevMessages.find((m) => m._id === message._id)) return prevMessages;
        return [...prevMessages, message];
      });
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, orderId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user || !orderId) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-white text-xl">Loading chat...</h2>
      </div>
    );
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      orderId,
      senderId: user.id,
      receiverId: otherPartyId,
      message: newMessage,
    };

    // Optimistic UI update (but without overwriting timestamps)
    const tempId = "temp-" + Date.now();
    const optimisticMessage = { _id: tempId, ...messageData, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimisticMessage]);

    // Send message via WebSocket
    socket.emit("sendMessage", messageData);

    setNewMessage(""); // Clear input field
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 text-center text-xl font-semibold">
        Chat
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`mb-2 flex flex-col ${
              msg.senderId === user.id ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`px-4 py-2 rounded-xl text-sm shadow-lg bg-opacity-70 backdrop-blur-md ${
                msg.senderId === user.id
                  ? "bg-pink-500 text-white glow-pink"
                  : "bg-blue-500 text-white glow-blue"
              }`}
            >
              {msg.message}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {msg.createdAt ? format(new Date(msg.createdAt), "hh:mm a") : ""}
            </span>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-pink-500 transition"
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
