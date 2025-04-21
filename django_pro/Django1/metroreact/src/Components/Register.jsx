import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for password visibility

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', {
                username,
                email,
                password,
                age,
            });
            alert("Account created successfully");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Email or username already exists");
        }
    };

    return (
        <div className='mainpage'>
            <div className='maincontainer'>
                <h1>Register</h1>
                <form className='mainform' onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    {/* Password Input with Toggle Eye Icon */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", paddingRight: "40px" }} // Space for the icon
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "10px",
                                cursor: "pointer",
                                color: "#555"
                            }}
                        >
                            {showPassword ? <FaEye />:<FaEyeSlash />}
                        </span>
                    </div>

                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />

                    <Button variant="success" type="submit">Register</Button>
                </form>
            </div>
        </div>
    );
};

export default Register;
