import React, { useState, useEffect, useRef, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import AuthContext from "../context/Auth.js";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Chat = () => {
  const { orderId, artistId, customerId } = useParams();
  const socket = useSocket();
  const { userState } = useContext(AuthContext);
  const user = userState.user;
  const otherPartyId = user.role === "customer" ? artistId : customerId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket || !orderId || !user) return;

    socket.emit("join", { userId: user.id, orderId });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4800/api/chats/${orderId}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    socket.on("receiveMessage", (message) => {
      console.log("Received message from backend:", message);
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m._id.startsWith("temp-") && m.senderId === message.senderId ? message : m
        )
      );
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, orderId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const tempId = "temp-" + Date.now();
    const messageData = {
      orderId,
      senderId: user.id,
      receiverId: otherPartyId,
      message: newMessage,
    };

    const optimisticMessage = { _id: tempId, ...messageData, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimisticMessage]);

    socket.emit("sendMessage", messageData, (serverResponse) => {
      if (serverResponse && serverResponse._id) {
        console.log("Message stored successfully:", serverResponse);
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m._id === tempId ? { ...serverResponse } : m
          )
        );
      } else {
        console.error("Message storage failed:", serverResponse);
      }
    });

    setNewMessage("");
  };

  const handleEdit = async (chatId) => {
    const updatedMessage = prompt("Edit your message:");
    if (!updatedMessage) return;

    try {
      const response = await axios.put(
        `http://localhost:4800/api/chats/${chatId}`,
        { newMessage: updatedMessage },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log("Edited message response:", response.data);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === chatId ? { ...msg, message: response.data.message } : msg))
      );
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`http://localhost:4800/api/chats/${chatId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("Deleted message with ID:", chatId);
      setMessages((prev) => prev.filter((msg) => msg._id !== chatId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="p-4 border-b border-gray-700 text-center text-xl font-semibold">Chat</div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <motion.div
            key={msg._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`mb-2 flex flex-col ${msg.senderId === user.id ? "items-end" : "items-start"}`}
            onClick={() => setSelectedMessage(selectedMessage === msg._id ? null : msg._id)}
          >
            <span className={`px-4 py-2 rounded-xl text-sm shadow-lg bg-opacity-70 backdrop-blur-md ${msg.senderId === user.id ? "bg-pink-500 text-white" : "bg-blue-500 text-white"}`}>
              {msg.message}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {msg.createdAt ? format(new Date(msg.createdAt), "hh:mm a") : ""}
            </span>
            {selectedMessage === msg._id && msg.senderId === user.id && (
              <div className="flex gap-2 mt-1">
                <button className="text-sm text-yellow-400" onClick={() => handleEdit(msg._id)}>Edit</button>
                <button className="text-sm text-red-400" onClick={() => handleDelete(msg._id)}>Delete</button>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-pink-500 transition"
        />
        <button onClick={sendMessage} className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-lg transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
