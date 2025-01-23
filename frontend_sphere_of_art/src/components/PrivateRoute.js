// Import necessary modules from react-router-dom and React context
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/Auth.js";

// The PrivateRoute component is used to protect routes that require authentication
export default function PrivateRoute({ children }) {
  // Access the user authentication state from the AuthContext
  const { userState } = useContext(AuthContext);

  // If the user is not authenticated (no user object in state), redirect them to the login page
  if (!userState.user) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the children components (protected route content)
  return children;
}
