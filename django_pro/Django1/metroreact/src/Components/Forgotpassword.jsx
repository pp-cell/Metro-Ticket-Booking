import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/request-reset/',
                { email },
                {
                    withCredentials: true, // ✅ Ensures cookies are sent
                    headers: { 'Content-Type': 'application/json' }, // ✅ Explicit JSON headers
                }
            );

            if (response.status === 200) {
                setMessage(response.data.message || 'Password reset OTP sent! Check your email.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            setTimeout(() => {
                navigate("/reset-password");
              }, 2000);
        } catch (error) {
            console.error('Error:', error.response || error);
            setError(error.response?.data?.error || 'Failed to send password reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mainpage">
            <div className="maincontainer">
                <h1>Forgot Password?</h1>
                <p>Enter your email address to reset your password.</p>

                {/* Success & Error Messages */}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <form className="mainform" onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                
               
            </div>
        </div>
    );
};

export default ForgotPassword;
