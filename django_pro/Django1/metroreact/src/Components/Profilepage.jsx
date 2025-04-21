import React, { useState } from 'react';
import { useUser } from '../UserStore'; // Import the useUser hook
import axios from 'axios';
const ProfilePage = () => {
    const { user, updateUser } = useUser(); // Get the user and updateUser function from the context
    const [formData, setFormData] = useState({
        username: user?.username || '',
        age: user?.age || '',
        email: user?.email || '',
        password: '', // Password field can be left empty for security
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        

        try {
            // Send a PUT request to the backend to update the profile
            const response = await axios.put('http://127.0.0.1:8000/api/update-profile/', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Include the access token
                },
            });
            

            // Update the user data in the frontend context
            updateUser(response.data);

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">
                        Age
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password (leave blank to keep current)"
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;