// Importing the main CSS file for styling
import './App.css';

// Importing components and hooks from react-router-dom for navigation and routing
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

// Importing the authentication context to access user-related state and actions
import AuthContext from './context/Auth.js';

// Importing the useContext hook to consume the authentication context
import { useContext } from 'react';

// Importing different page components
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindArtist from './pages/FindArtist';
import Order from './pages/Order';
import Profile from './pages/Profile';

// The main App component
export default function App(props) {
  // Consuming user state and authentication-related actions from AuthContext
  const { userState } = useContext(AuthContext);

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  return (
    <div className="App">
      {/* Top navigation bar */}
      <ul id="top-nav">
        {/* Always visible Home link */}
        <li><Link to="/home">Home</Link></li>

        {/* Conditional rendering based on user login state */}
        {!userState.isLoggedIn ? (
          <>
            {/* Links visible when the user is not logged in */}
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            {/* Links visible when the user is logged in */}
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/findartist">Find Your Artist</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {/* Logout button that clears user session and navigates to Home */}
          </>
        )}
      </ul>
      
      {/* Route definitions for the application */}
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/findartist" element={<FindArtist />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
