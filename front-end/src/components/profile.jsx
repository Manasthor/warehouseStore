import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch API URL from environment variables
    const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    navigate('/login');  // Redirect to login if user is not logged in
                    return;
                }

                const userData = JSON.parse(storedUser);
                const userId = userData._id;

                let response = await fetch(`${API_BASE_URL}/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    let errorData = await response.json();
                    setError(errorData.message || `Error: ${response.status}`);
                    return;
                }

                let result = await response.json();
                setUser(result);
            } catch (err) {
                console.error('Error fetching user profile:');
                setError('Failed to fetch user profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, API_BASE_URL]);

    const handleUpdate = () => {
        if (user) {
            navigate(`/updateuser/${user._id}`);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
                <p className="text-center">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">User Profile</h1>

            {user ? (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                    {user.role && <p><strong>Role:</strong> {user.role}</p>}
                    
                    {/* Update Profile Button */}
                    <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Update Profile
                    </button>
                </div>
            ) : (
                <p className="text-red-500 text-center">No user found</p>
            )}
        </div>
    );
};

export default Profile;
