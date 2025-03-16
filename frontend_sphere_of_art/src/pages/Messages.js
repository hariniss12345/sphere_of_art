import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const messages = {
  "/home": "Next, move to the Profile page and complete your details.",  
  "/profile": "Check your Orders to stay updated.",
  "/orders": "Explore Artists to commission artwork.",
};

const Messages = () => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log("Current path:", location.pathname); // Debugging log

    const showMessage = () => {
      setMessage(messages[location.pathname] || "Explore our platform!");
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 4000); // Hide after 4 seconds
    };

    showMessage(); // Show first message immediately
    const interval = setInterval(showMessage, 6000); // Repeat every 6 sec

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {visible && (
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-500 animate-slideIn">
          {message}
        </div>
      )}
    </div>
  );
};

export default Messages;
