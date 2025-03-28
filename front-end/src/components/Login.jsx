import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            navigate('/'); // Redirect to homepage if already logged in
        }
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok || !data.user) {
                throw new Error(data.error || "Invalid email or password");
            }

            // Store user details
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/'); // Redirect to homepage
            window.location.reload(); // Refresh to reflect login status
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-30 p-10">
            <h1>Log In</h1>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-blue-300 p-1 m-1 block w-72"
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-blue-300 p-1 m-1 block w-72"
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleLogin}
                className={`bg-pink-100 p-1 m-1 border-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </div>
    );
};

export default Login;