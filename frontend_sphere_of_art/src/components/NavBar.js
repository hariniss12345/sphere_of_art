import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/Auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { userState, handelLogout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-black p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden block text-white focus:outline-none"
          >
            <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} className="h-8 w-8 text-white" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center">
          <ul className="flex items-center space-x-6">
            {!userState.isLoggedIn ? (
              <li>
                <Link to="/login" className="px-4 hover:text-gray-400">
                  Login <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                </Link>
              </li>
            ) : (
              <>
                <li><Link to="/home" className="px-4 hover:text-gray-400">Home</Link></li>
                <li><Link to="/dashboard" className="px-4 hover:text-gray-400">Dashboard</Link></li>
                {userState.user?.role === "customer" && <li><Link to="/findartist" className="px-4 hover:text-gray-400">Find Your Artist</Link></li>}
                <li><Link to="/profile" className="px-4 hover:text-gray-400">Profile</Link></li>
                {userState.user?.role === "artist" && (
                  <>
                    <li><Link to="/portfolio" className="px-4 hover:text-gray-400">Portfolio</Link></li>
                    <li><Link to="/portfolioupload" className="px-4 hover:text-gray-400">Portfolio Upload</Link></li>
                    <li><Link to={`/order-hub/${userState.user.id}`} className="px-4 hover:text-gray-400">Order Hub</Link></li>
                  </>
                )}
                {userState.user?.role === "customer" && (
                  <li><Link to={`/my-orders/${userState.user.id}`} className="px-4 hover:text-gray-400">My Orders</Link></li>
                )}
                {userState.user?.role === "customer" && (
                  <li><Link to={`/reviews/customer/${userState.user.id}`} className="px-4 hover:text-gray-400">Reviews</Link></li>
                )}
                {userState.user?.role === "artist" && (
                  <li><Link to={`/reviews/artist/${userState.user.id}`} className="px-4 hover:text-gray-400">Reviews</Link></li>
                )}
                {userState.user?.role === "admin" && (
                  <>
                    <li><Link to='/verify-artist' className="px-4 hover:text-gray-400">Verify Artist</Link></li>
                    <li><Link to='/manage-users' className="px-4 hover:text-gray-400">Manage Users</Link></li>
                    <li><Link to='/manage-commission' className="px-4 hover:text-gray-400">Manage Commission</Link></li>
                  </>
                )}
                <li>
                  <button
                    onClick={() => {
                      handelLogout();
                      localStorage.removeItem("token");
                      navigate("/main");
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    LOGOUT
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-2 p-4 rounded bg-black">
          {!userState.isLoggedIn ? (
            <li className="py-2">
              <Link to="/login" className="block px-4 hover:text-gray-400">Login</Link>
            </li>
          ) : (
            <>
              <li className="py-2"><Link to="/home" className="block px-4 hover:text-gray-400">Home</Link></li>
              <li className="py-2"><Link to="/dashboard" className="block px-4 hover:text-gray-400">Dashboard</Link></li>
              {userState.user?.role === "customer" && <li className="py-2"><Link to="/findartist" className="block px-4 hover:text-gray-400">Find Your Artist</Link></li>}
              <li className="py-2"><Link to="/profile" className="block px-4 hover:text-gray-400">Profile</Link></li>
              {userState.user?.role === "artist" && (
                <>
                  <li className="py-2"><Link to="/portfolio" className="block px-4 hover:text-gray-400">Portfolio</Link></li>
                  <li className="py-2"><Link to="/portfolioupload" className="block px-4 hover:text-gray-400">Portfolio Upload</Link></li>
                  <li className="py-2"><Link to={`/order-hub/${userState.user.id}`} className="block px-4 hover:text-gray-400">Order Hub</Link></li>
                </>
              )}
              <li className="py-2">
                <button
                  onClick={() => {
                    handelLogout();
                    localStorage.removeItem("token");
                    navigate("/home");
                  }}
                  className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                >
                  LOGOUT
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}
