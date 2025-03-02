import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Use environment variable or fallback to Render API
    const API_URL = import.meta.env.REACT_APP_API_URL || "https://warehousestore.onrender.com";

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/'); // Navigate to products page after login
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            let response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            let data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            alert("Login successful! Redirecting...");
            navigate('/products'); // Redirect to products page
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.message);
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
            <button
                onClick={handleLogin}
                className="bg-pink-100 p-1 m-1 border-1 pointer-events-auto"
            >
                Login
            </button>
        </div>
    );
};

export default Login;
