import React, { useState, useEffect, useContext } from "react";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import AuthContext from "../context/Auth.js";

const Chat = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Get orderId and artistId from URL parameters
  const { orderId, artistId } = useParams();

  // Get user from AuthContext
  const { userState } = useContext(AuthContext);
  const user = userState?.user;
  const customerId = user?._id;

  // Debug logs
  console.log("orderId:", orderId);
  console.log("artistId:", artistId);
  console.log("userState:", userState);
  console.log("customerId:", customerId);

  useEffect(() => {
    if (!socket || !orderId || !user) return;

    socket.emit("join", user._id);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4800/api/chats/${orderId}`);
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, orderId, user]);

  // Use a less strict condition for debugging (if artistId might not be required immediately)
  if (!user || !orderId || !customerId) {
    return (
      <div className="h-screen flex justify-center items-center bg-black">
        <h2 className="text-white text-xl">Loading chat...</h2>
      </div>
    );
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      orderId,
      senderId: user._id,
      // If user is a customer, receiver is the artist; if not, assume receiver is the customer.
      receiverId: user.role === "customer" ? artistId : customerId,
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);

    try {
      await axios.post("http://localhost:4800/api/chats", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg w-full bg-white shadow-md">
      <div className="h-60 overflow-y-auto p-2 border-b">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.senderId === user._id ? "text-right" : "text-left"}`}
          >
            <span className="bg-gray-800 p-2 rounded-lg text-white">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
