import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useUser } from '../UserStore';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { updateUser } = useUser();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            updateUser(response.data.user);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Incorrect password or username.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='mainpage'>
            <div className='maincontainer'>
                <h1>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form className='mainform' onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <div className='password-container'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className='eye-icon' onClick={togglePasswordVisibility}>
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>
                    <Button variant="success" type="submit">Login</Button>

                    <p>
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </p>

                    <Link  to='/register' id='link1'>Create a New Account</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
