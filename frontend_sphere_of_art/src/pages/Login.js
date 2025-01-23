// Importing required modules and hooks
import { useState } from "react"; // useState for managing form inputs and errors
import AuthContext from "../context/Auth.js"; // AuthContext for accessing authentication-related functions
import { useContext } from "react"; // useContext to consume AuthContext
import { useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation
import axios from 'axios'; // axios for making HTTP requests

export default function Login() {
    // Accessing `handleLogin` from AuthContext
    const { handleLogin } = useContext(AuthContext); 

    // Hook for navigation
    const navigate = useNavigate(); 

    // State to manage form inputs
    const [formData, setFormadata] = useState({
        username: "",
        email: "",
        password: ""
    });

    // State to manage client-side and server-side errors
    const [clientErrors, setClientErros] = useState(null);
    const [serverErrors, setServerErrors] = useState(null);

    // Object to store client-side validation errors
    const clientValidationsErrors = {};

    // Function to run client-side validations
    const runClientValidations = () => {
        // Check if username is empty
        if (formData.username.trim().length === 0) {
            clientValidationsErrors.username = 'Username is required';
        }

        // Check if password is empty
        if (formData.password.trim().length === 0) {
            clientValidationsErrors.password = 'Password is required';
        }

        // Check if email is empty
        if (formData.email.trim().length === 0) {
            clientValidationsErrors.email = 'Email is required';
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        runClientValidations(); // Run client-side validations

        // Check if there are no client-side validation errors
        if (Object.keys(clientValidationsErrors).length === 0) {
            try {
                // Send login request to the server
                const response = await axios.post('http://localhost:4700/api/users/login', formData);
                localStorage.setItem('token', response.data.token); // Save the token in localStorage

                // Fetch user profile after successful login
                const userResponse = await axios.get('http://localhost:4700/api/users/profile', {
                    headers: { Authorization: localStorage.getItem('token') }
                });

                // Log the user in using `handleLogin`
                handleLogin(userResponse.data);

                // Redirect to the dashboard
                navigate('/dashboard');
            } catch (err) {
                // Set server-side errors if login fails
                setServerErrors(err.response.data.errors);
            }
            setClientErros({}); // Clear client-side errors
        } else {
            setClientErros(clientValidationsErrors); // Set client-side validation errors
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

            {/* Login form */}
            <form onSubmit={handleSubmit}>
                {/* Username input */}
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormadata({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                />
                {clientErrors && <span style={{ color: 'red' }}>{clientErrors.username}</span>}
                <br />

                {/* Email input */}
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormadata({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                />
                {clientErrors && <span style={{ color: 'red' }}>{clientErrors.email}</span>}
                <br />

                {/* Password input */}
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormadata({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                />
                {clientErrors && <span style={{ color: 'red' }}>{clientErrors.password}</span>}
                <br />

                {/* Submit button */}
                <input type="submit" value="Sign In" />
            </form>
        </div>
    );
}
