import './App.css'; // Importing the main CSS file for styling
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import AuthContext from './context/Auth.js'; // Importing the authentication context
import PrivateRoute from './components/PrivateRoute.js'; // Import PrivateRoute for protected routes
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
import Portfolio from './pages/Portfolio';
import PortfolioUpload from './pages/PortfolioUpload';
import ArtistProfile from './pages/ArtistProfile';
import OrderHub from './pages/OrderHub';
import MyOrders from './pages/MyOrders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const { userState, handelLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="App">
      {/* Top navigation bar */}
      <ul className="flex justify-between bg-gray-800 p-4 text-white">
        <li>
          <Link to="/home" className="hover:text-gray-400">Home</Link>
        </li>

        {!userState.isLoggedIn ? (
          <>
            <li>
              <Link to="/register" className="hover:text-gray-400">Register</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-400">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
            </li>
            {userState.user?.role === 'customer' && (
              <li>
                <Link to="/findartist" className="hover:text-gray-400">Find Your Artist</Link>
              </li>
            )}
            {userState.user?.role === 'customer' && (
              <li>
                <Link to="/order" className="hover:text-gray-400">Order</Link>
              </li>
            )}
            <li>
              <Link to="/profile" className="hover:text-gray-400">Profile</Link>
            </li>
            {userState.user?.role === 'artist' && (
              <>
                <li>
                  <Link to="/portfolio" className="hover:text-gray-400">Portfolio</Link>
                </li>
                <li>
                  <Link to="/portfolioupload" className="hover:text-gray-400">Portfolio Upload</Link>
                </li>
                <li>
                  <Link to={`/order-hub/${userState.user.id}`} className="hover:text-gray-400">Order Hub</Link>
                </li>
              </>
            )}
            {userState.user?.role === 'customer' && (
              <li>
                <Link to={`/my-orders/${userState.user.id}`} className="hover:text-gray-400">My Orders</Link>
              </li>
            )}
            {/* Logout button */}
            <li>
              <button
                onClick={() => {
                  handelLogout();
                  localStorage.removeItem('token');
                  navigate('/home');
                }}
                className="text-white bg-red-600 hover:bg-red-700 p-2 rounded"
              >
                LOGOUT
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Route definitions for the application */}
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/findartist" element={<PrivateRoute permittedRoles={['customer']}><FindArtist /></PrivateRoute>} />
        <Route path="/artist-profile/:id" element={<ArtistProfile />} />
        <Route path="/order" element={<PrivateRoute permittedRoles={['customer']}><Order /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute permittedRoles={['artist']}><Portfolio /></PrivateRoute>} />
        <Route path="/portfolioupload" element={<PrivateRoute permittedRoles={['artist']}><PortfolioUpload /></PrivateRoute>} />
        <Route path="/order-hub/:artistId" element={<PrivateRoute permittedRoles={['artist']}><OrderHub /></PrivateRoute>} />
        <Route path="/my-orders/:customerId" element={<PrivateRoute permittedRoles={['customer']}><MyOrders /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}
