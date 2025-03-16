import "./App.css";
import { Routes, Route,Navigate } from "react-router-dom";


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
import AddReview from './pages/AddReview'
import Chat from './pages/Chat'
import Reviews from './pages/Reviews'
import ArtistReviews from './pages/ArtistReviews'
import AdminArtistList from './pages/AdminArtistList'
import ManageUsers from './pages/ManageUsers'
import Commission from './pages/Commission'
import Messages from './pages/Messages'

export default function App() {
  
  return (
    <div className="App">
      <div className = "min-h-screen bg-black">
      {/* Navigation Bar */}
      <NavBar />

      <Messages/>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
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
        <Route path="/review/order/:orderId/artist/:artistId" element={<PrivateRoute permittedRoles={['customer']}><AddReview/></PrivateRoute>}/>
        <Route path="/chat/order/:orderId/artist/:artistId" element={<Chat/>}/>
        <Route path="/chat/order/:orderId/customer/:customerId" element={<Chat/>}/>
        <Route path="/reviews/customer/:customerId" element={<PrivateRoute permittedRoles={['customer']}><Reviews/></PrivateRoute>} />
        <Route path="/reviews/artist/:artistId" element={<PrivateRoute permittedRoles={['artist']}><ArtistReviews/></PrivateRoute>}/>
        <Route path="/verify-artist" element={<PrivateRoute permittedRoles={['admin']}><AdminArtistList/></PrivateRoute>}/>
        <Route path="/manage-users" element={<PrivateRoute permittedRoles={['admin']}><ManageUsers/></PrivateRoute>}/>
        <Route path="/manage-commission" element={<PrivateRoute permittedRoles={['admin']}><Commission/></PrivateRoute>}/>
      </Routes>
      </div>
    </div>
  );
}
