import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../redux/slices/authSlice';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, message, error: apiError } = useSelector(state => state.auth);
    
    // Extract token from URL
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing token.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!token) {
            setError('Token is missing or invalid.');
            return;
        }

        await dispatch(resetPassword({ token, newPassword }));

        if (!apiError) {
            navigate('/login'); // Redirect user to login after success
        } else {
            setError(apiError);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
