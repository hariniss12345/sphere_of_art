import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const { handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const errors = {};

  const runClientValidations = () => {
    if (formData.usernameOrEmail.trim().length === 0) {
      errors.usernameOrEmail = "Username or Email is required";
    }
    if (formData.password.trim().length === 0) {
      errors.password = "Password is required";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientValidations();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:4800/api/users/login",
          formData
        );
        localStorage.setItem("token", response.data.token);

        const userResponse = await axios.get(
          "http://localhost:4800/api/users/profile",
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );

        handleLogin(userResponse.data);
        navigate("/dashboard");
      } catch (err) {
        setServerErrors(err.response.data.errors);
      }
      setClientErrors({});
    } else {
      setClientErrors(errors);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        {serverErrors && <div className="text-red-500 text-center mb-4">{serverErrors}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
            placeholder="Enter username or email"
          />
          {clientErrors.usernameOrEmail && <p className="text-red-500 text-sm">{clientErrors.usernameOrEmail}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            />
          </div>
          {clientErrors.password && <p className="text-red-500 text-sm">{clientErrors.password}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign In
          </button>

          <p className="text-center text-sm mt-3">
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
