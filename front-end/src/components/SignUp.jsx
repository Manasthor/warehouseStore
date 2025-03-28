import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async () => {
        // Basic form validation
        if (!name || !email || !password) {
            setError("All fields are required!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Enter a valid email address!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            navigate('/');
            window.location.reload(); // Ensure session updates
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-30 p-10">
            <h1 className="text-2xl font-bold mb-4">Register</h1>

            {error && <p className="text-red-500">{error}</p>}

            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-blue-300 p-2 m-1 block w-72 rounded"
            />
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-blue-300 p-2 m-1 block w-72 rounded"
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-blue-300 p-2 m-1 block w-72 rounded"
            />

            <button
                onClick={handleRegister}
                className={`bg-pink-500 text-white p-2 mt-2 w-72 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
        </div>
    );
};

export default SignUp;