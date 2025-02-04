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
    <div className="login">
      <h2>Login Page</h2>

      {serverErrors && (
        <div>
          <b>{serverErrors}</b>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.usernameOrEmail}
          onChange={(e) =>
            setFormData({ ...formData, usernameOrEmail: e.target.value })
          }
          placeholder="Enter username or email"
        />
        {clientErrors.usernameOrEmail && (
          <span style={{ color: "red" }}>{clientErrors.usernameOrEmail}</span>
        )}
        <br />

        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter password"
            style={{ paddingRight: "2rem" }}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          />
        </div>
        {clientErrors.password && (
          <span style={{ color: "red" }}>{clientErrors.password}</span>
        )}
        <br />

        <input type="submit" value="Sign In" />

        {/* Forgot Password Link */}
        <p>
          <span
            style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>
      </form>
    </div>
  );
}
