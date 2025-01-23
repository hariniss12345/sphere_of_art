import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/Auth.js";

export default function PrivateRoute({ children }) {
  const { userState } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!userState.user) {
    return <Navigate to="/login" />;
  }

  return children;
}
