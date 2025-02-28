import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    setError('User not logged in.');
                    setLoading(false);
                    return;
                }
                const userData = JSON.parse(storedUser);
                const userId = userData._id; // Assuming your user object has an _id property

                let response = await fetch(`http://localhost:5000/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('User not found.');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    let result = await response.json();
                    setUser(result);
                }
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to fetch user profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdate = () => {
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            const userData = JSON.parse(storedUser);
            navigate(`/updateuser/${userData._id}`);
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
                </div>
            ) : (
                <p className="text-red-500 text-center">No user found</p>
            )}
        </div>
    );
};

export default Profile;