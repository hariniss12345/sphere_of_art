import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/Auth";

export default function Login() {
  const { handleLogin } = useContext(AuthContext); // Context to manage authentication state
  const navigate = useNavigate(); // Navigation hook to redirect users

  // State to store form data (username/email and password)
  const [formData, setFormdata] = useState({
    usernameOrEmail: "",
    password: "",
  });

  // State to store validation errors from the client
  const [clientErrors, setClientErrors] = useState({});
  // State to store errors returned by the server
  const [serverErrors, setServerErrors] = useState(null);
  const errors = {}; // Object to store validation errors temporarily

  // Function to validate form data on the client side
  const runClientValidations = () => {
    if (formData.usernameOrEmail.trim().length === 0) {
      errors.usernameOrEmail = "Username or Email is required"; // Error for empty username/email
    }
    if (formData.password.trim().length === 0) {
      errors.password = "Password is required"; // Error for empty password
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    runClientValidations(); // Run client-side validations
    if (Object.keys(errors).length === 0) {
      try {
        // Send login request to the server
        const response = await axios.post(
          "http://localhost:4700/api/users/login",
          formData
        );
        localStorage.setItem("token", response.data.token); // Save the token in localStorage

        // Fetch user profile after successful login
        const userResponse = await axios.get(
          "http://localhost:4700/api/users/profile",
          {
            headers: { Authorization: localStorage.getItem("token")}, // Add token in headers
          }
        );

        // Log the user in using handleLogin
        handleLogin(userResponse.data);

        // Redirect to the dashboard
        navigate("/dashboard");
      } catch (err) {
        // Set server-side errors if login fails
        setServerErrors(err.response.data.errors);
      }
      setClientErrors({}); // Clear client-side errors
    } else {
      setClientErrors(errors); // Set client-side validation errors
    }
  };

  return (
    <div className="login">
      <h2>Login Page</h2>
      {/* Display server-side errors if any */}
      {serverErrors && (
        <div>
          <b>{serverErrors}</b>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Username or Email input */}
        <input
          type="text"
          value={formData.usernameOrEmail}
          onChange={(e) =>
            setFormdata({ ...formData, usernameOrEmail: e.target.value }) // Update username/email field
          }
          placeholder="Enter username or email"
        />
        {clientErrors.usernameOrEmail && (
          <span style={{ color: "red" }}>{clientErrors.usernameOrEmail}</span> // Show client-side validation error
        )}
        <br />

        {/* Password input */}
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormdata({ ...formData, password: e.target.value }) // Update password field
          }
          placeholder="Enter password"
        />
        {clientErrors.password && (
          <span style={{ color: "red" }}>{clientErrors.password}</span> // Show client-side validation error
        )}
        <br />

        {/* Submit button */}
        <input type="submit" value="Sign In" />
      </form>
    </div>
  );
}