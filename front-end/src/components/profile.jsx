import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch API Base URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            const storedUser = localStorage.getItem('user');

            if (!storedUser) {
                navigate('/login'); // Redirect to login if user is not logged in
                return;
            }

            const userData = JSON.parse(storedUser);
            const userId = userData._id;

            try {
                let response = await fetch(`${API_URL}/user/${userId}`, {
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
                console.error('Error fetching user profile:', err);
                setError('Failed to fetch user profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, API_URL]);

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

                    {/* Logout Button */}
                    <button 
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/login');
                        }} 
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                        Logout
                    </button>
                </div>
            ) : (
                <p className="text-red-500 text-center">No user found</p>
            )}
        </div>
    );
};

export default Profile;