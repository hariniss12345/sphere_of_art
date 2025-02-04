// Importing the AuthContext for sharing authentication-related state and actions across the app
import AuthContext from '../context/Auth.js';

// Importing hooks for state management and side effects
import { useReducer, useEffect } from 'react';

// Importing the userReducer to handle authentication-related state transitions
import userReducer from '../reducers/userReducer.js';

// Importing axios for making API calls
import axios from 'axios';

// Initial state for the authentication context
const initialState = {
    isLoggedIn: false, // Indicates whether the user is logged in
    user: null         // Stores the user's details when logged in
};

// AuthProvider component to manage authentication state and logic
export default function AuthProvider(props) {
    // useReducer hook for managing complex state transitions with the userReducer
    const [userState, userDispatch] = useReducer(userReducer, initialState);

    // Function to handle user login and update the state
    const handleLogin = (user) => {
        return userDispatch({ type: 'LOGIN', payload: { isLoggedIn: true, user: user } });
    };

    // Function to handle user logout and reset the state
    const handelLogout = () => {
        return userDispatch({ type: 'LOGOUT', payload: { isLoggedIn: false, user: null } });
    };

    // useEffect hook to check for a valid token on component mount
    useEffect(() => {
        (async () => {
            // Check if a token exists in localStorage
            if (localStorage.getItem('token')) {
                try {
                    // Fetch the user's profile using the token
                    const response = await axios.get(
                        'http://localhost:4800/api/users/profile',
                        { headers: { Authorization: localStorage.getItem('token') } }
                    );
                    // Log the user in with the received data
                    handleLogin(response.data);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                    handelLogout(); // Logout on error or invalid token
                }
            }
        })();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Render a loading message if a token exists but the user's data hasn't been fetched yet
    // if (localStorage.getItem('token') && !userState.user) {
    //     return <p>loading...</p>;
    // }

    return (
        <div>
            {/* Providing authentication-related state and actions to child components */}
            <AuthContext.Provider value={{ userState, handleLogin, handelLogout }}>
                {props.children} {/* Rendering child components */}
            </AuthContext.Provider>
        </div>
    );
}
