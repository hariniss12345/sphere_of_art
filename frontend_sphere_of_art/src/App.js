import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthContext from "./context/Auth.js";
import { useContext } from "react";

// Import Components
import NavBar from "./components/NavBar.js"; // Import new Navbar
import PrivateRoute from "./components/PrivateRoute.js";

// Import Pages
import MainPage from "./pages/MainPage";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FindArtist from "./pages/FindArtist";
import Order from "./pages/Order";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import PortfolioUpload from "./pages/PortfolioUpload";
import ArtistProfile from "./pages/ArtistProfile";
import OrderHub from "./pages/OrderHub";
import MyOrders from "./pages/MyOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentPage from './pages/PaymentPage'
import OrderConfirmation from './pages/OrderConfirmation'

export default function App() {
  const { userState } = useContext(AuthContext);

  return (
    <div className="App">
      {/* Navigation Bar */}
      <NavBar />

      {/* Routes */}
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/findartist" element={<PrivateRoute permittedRoles={['customer']}><FindArtist /></PrivateRoute>} />
        <Route path="/artist-profile/:id" element={<ArtistProfile />} />
        <Route path="/order/:id" element={<PrivateRoute permittedRoles={['customer']}><Order /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute permittedRoles={['artist']}><Portfolio /></PrivateRoute>} />
        <Route path="/portfolioupload" element={<PrivateRoute permittedRoles={['artist']}><PortfolioUpload /></PrivateRoute>} />
        <Route path="/order-hub/:artistId" element={<PrivateRoute permittedRoles={['artist']}><OrderHub /></PrivateRoute>} />
        <Route path="/my-orders/:customerId" element={<PrivateRoute permittedRoles={['customer']}><MyOrders /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment/:orderId" element={<PrivateRoute permittedRoles={['customer']}><PaymentPage /></PrivateRoute>} />
        <Route path="/order-confirmation" element={<PrivateRoute permittedRoles={['customer']}><OrderConfirmation /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
