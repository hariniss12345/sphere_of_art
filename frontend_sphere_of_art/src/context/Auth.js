// Importing createContext from React to create a context for authentication
import { createContext } from 'react';

// Creating the AuthContext which will hold the authentication state and functions
const AuthContext = createContext();

// Exporting the AuthContext to be used across the application
export default AuthContext;
