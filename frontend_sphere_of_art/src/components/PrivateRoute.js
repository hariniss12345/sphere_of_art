import { Navigate } from "react-router-dom"; // Importing Navigate for redirecting unauthorized users
import AuthContext from "../context/Auth.js"; // Importing AuthContext to access authentication state
import { useContext } from "react"; // Importing useContext to access AuthContext

export default function PrivateRoute(props) {
    // Accessing user authentication state from AuthContext
    const { userState } = useContext(AuthContext);

    // If there is no token in localStorage and no authenticated user, redirect to login page
    if (!localStorage.getItem('token') && !userState.user) {
        return <Navigate to="/login" replace />;
    }
    // If permittedRoles is provided and the user's role is allowed, render the children components
    else if (props.permittedRoles && props.permittedRoles.includes(userState.user.role)) {
        return props.children;
    }
    // If permittedRoles is provided but the user's role is not allowed, show "unauthorized" message
    else if (props.permittedRoles && !props.permittedRoles.includes(userState.user.role)) {
        return <p>Unauthorized</p>;
    }
    // If the user is authenticated, render the children components
    else if (userState) {
        return props.children;
    }
}
