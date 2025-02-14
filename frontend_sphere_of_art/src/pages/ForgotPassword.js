import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/slices/authSlice";
import Swal from "sweetalert2"; // Import SweetAlert2

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.auth);

  const runClientValidations = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = runClientValidations();
    if (Object.keys(errors).length === 0) {
      dispatch(forgotPassword(email));  // Dispatch forgotPassword with the email
      setClientErrors({});
    } else {
      setClientErrors(errors);
    }
  };

  // Show SweetAlert2 notifications when message or error updates
  useEffect(() => {
    if (message) {
      // Display a success message for password reset link sent
      Swal.fire({
        title: "Success!",
        text: "Password reset link sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }

    if (error) {
      // Display an error message in case of failure
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  }, [message, error]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {clientErrors.email && <p className="text-red-500 text-sm mt-1">{clientErrors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
