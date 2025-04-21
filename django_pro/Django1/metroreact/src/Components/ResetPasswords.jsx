import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ResetPasswords.css';


const ResetPasswords = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/reset-password/", {
        token,
        new_password: newPassword,
      });

      setMessage(response.data.message);
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Token</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ResetPasswords;
