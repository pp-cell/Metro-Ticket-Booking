import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
const UserContext = createContext();

// Create a custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Create a UserProvider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to update the user
    const updateUser = (userData) => {
        setUser(userData);
    };

    // Function to clear the user (logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};