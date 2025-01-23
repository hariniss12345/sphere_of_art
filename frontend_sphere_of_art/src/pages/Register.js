// Importing the main CSS file for styling
import '../App.css';

// Importing hooks and libraries
import { useState } from "react"; // useState for managing form data and errors
import { useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation
import axios from 'axios'; // axios for making HTTP requests

export default function Register() {
    // Hook for programmatic navigation
    const navigate = useNavigate(); 

    // State for managing form inputs
    const [formData, setFormdata] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });

    // State for managing client-side and server-side errors
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

        // Check if role is not selected
        if (formData.role.trim().length === 0) {
            clientValidationsErrors.role = 'Role is required';
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        runClientValidations(); // Run client-side validations
        console.log(clientValidationsErrors);

        // Check if there are no client-side validation errors
        if (Object.keys(clientValidationsErrors).length === 0) {
            try {
                // Send form data to the server
                const response = await axios.post('http://localhost:4700/api/users/register', formData);
                navigate('/login'); // Navigate to login page on successful registration
                console.log(response.data); // Log server response
            } catch (err) {
                // Set server errors if the request fails
                setServerErrors(err.response.data.errors);
            }
            setClientErros({}); // Clear client errors
        } else {
            setClientErros(clientValidationsErrors); // Set client-side errors
        }
    };

    return (
        <>
            <h2>Register Page</h2>

            {/* Display server errors if present */}
            {serverErrors && (
                <div>
                    <h3>Server Errors</h3>
                    <ul>
                        {serverErrors.map((ele, i) => {
                            return <li key={i}>{ele.msg}</li>;
                        })}
                    </ul>
                </div>
            )}

            {/* Registration form */}
            <form onSubmit={handleSubmit}>
                {/* Username input */}
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormdata({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                />
                {clientErrors && <span style= {{color: 'red'}}>{clientErrors.username}</span>}
                <br/>

                {/* Email input */}
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormdata({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                />
                {clientErrors && <span style={{color: 'red'}} >{clientErrors.email}</span>}
                <br/>

                {/* Password input */}
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormdata({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                />
                {clientErrors && <span style ={{color: 'red'}}>{clientErrors.password}</span>}
                <br/>

                {/* Role selection (radio buttons) */}
                <input
                    type="radio"
                    name="role"
                    value="customer"
                    id="customer"
                    onChange={(e) => setFormdata({ ...formData, role: e.target.value })}
                />
                <label htmlFor="customer" name="customer">Customer</label>

                <input
                    type="radio"
                    name="role"
                    value="artist"
                    id="artist"
                    onChange={(e) => setFormdata({ ...formData, role: e.target.value })}
                />
                <label htmlFor="artist" name="artist">Artist</label>
                {clientErrors && <span style={{color: 'red'}}>{clientErrors.role}</span>}
                <br/> 
                
                {/* Submit button */}
                <input type="submit" value="Sign Up" />
            </form>
        </>
    );
}
