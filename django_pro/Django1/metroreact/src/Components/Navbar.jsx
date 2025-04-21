import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserStore'; // Import the useUser hook
import { FaUserCircle } from 'react-icons/fa'; // Import a profile icon from react-icons
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
    const navigate = useNavigate();
    const { user, clearUser } = useUser(); // Get the user and clearUser function from the context

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Clear the user context
        clearUser();

        // Redirect to the login page
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <div className="navbar-brand" >
                    <img src={'metrologo-removebg-preview.png'} alt="Logo" className="navbar-logo" /> 
                    Metro Ticket Booking App
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Left-aligned items */}
                    <ul className="navbar-nav me-auto">
                        {user && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">
                                    Dashboard
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Right-aligned items */}
                    <ul className="navbar-nav ms-auto">
                        {user && (
                            <div className='rightelement'>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <FaUserCircle size={30} /> {/* Profile icon */}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </div>
                        )}
                        {!user && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;