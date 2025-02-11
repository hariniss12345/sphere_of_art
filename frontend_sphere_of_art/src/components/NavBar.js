import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // Import Heroicons
import AuthContext from "../context/Auth.js";

export default function Navbar() {
  const { userState, handelLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Menu toggle state

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">ArtCommissions</h1>

        {/* Hamburger Menu Button (Visible only on small screens) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden block text-white focus:outline-none"
        >
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8" /> // Close icon when menu is open
          ) : (
            <Bars3Icon className="h-8 w-8" /> // Hamburger menu icon when closed
          )}
        </button>
      </div>

      {/* Navigation Links (Dropdown when menuOpen is true) */}
      <ul
        className={`${
          menuOpen ? "block" : "hidden"
        } md:flex md:items-center md:space-x-6 mt-2 md:mt-0 bg-gray-900 md:bg-transparent p-4 md:p-0 rounded md:rounded-none`}
      >
        {!userState.isLoggedIn ? (
          <>
            <li className="py-2">
              <Link to="/register" className="block px-4 hover:text-gray-400">
                Register
              </Link>
            </li>
            <li className="py-2">
              <Link to="/login" className="block px-4 hover:text-gray-400">
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="py-2">
              <Link to="/home" className="block px-4 hover:text-gray-400">
                Home
              </Link>
            </li>
            <li className="py-2">
              <Link to="/dashboard" className="block px-4 hover:text-gray-400">
                Dashboard
              </Link>
            </li>

            {userState.user?.role === "customer" && (
              <>
                <li className="py-2">
                  <Link
                    to="/findartist"
                    className="block px-4 hover:text-gray-400"
                  >
                    Find Your Artist
                  </Link>
                </li>
                <li className="py-2">
                  <Link to="/order" className="block px-4 hover:text-gray-400">
                    Order
                  </Link>
                </li>
              </>
            )}

            <li className="py-2">
              <Link to="/profile" className="block px-4 hover:text-gray-400">
                Profile
              </Link>
            </li>

            {userState.user?.role === "artist" && (
              <>
                <li className="py-2">
                  <Link
                    to="/portfolio"
                    className="block px-4 hover:text-gray-400"
                  >
                    Portfolio
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    to="/portfolioupload"
                    className="block px-4 hover:text-gray-400"
                  >
                    Portfolio Upload
                  </Link>
                </li>
                <li className="py-2">
                  <Link
                    to={`/order-hub/${userState.user.id}`}
                    className="block px-4 hover:text-gray-400"
                  >
                    Order Hub
                  </Link>
                </li>
              </>
            )}

            {userState.user?.role === "customer" && (
              <li className="py-2">
                <Link
                  to={`/my-orders/${userState.user.id}`}
                  className="block px-4 hover:text-gray-400"
                >
                  My Orders
                </Link>
              </li>
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
    </nav>
  );
}
