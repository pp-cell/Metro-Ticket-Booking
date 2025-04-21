import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserStore'; // Import the useUser hook

const PrivateRoute = () => {
    const { user } = useUser(); // Get the user from the context

    // If the user is authenticated, render the child components
    // Otherwise, redirect to the login page
    return !!user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;