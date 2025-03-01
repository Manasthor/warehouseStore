import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            let response = await fetch('https://warehousestore-1.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                let errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            let data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
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
                id="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                className="border-2 border-blue-300 p-1 m-1 block w-72"
            />
            <input
                type="password"
                placeholder="Enter your password"
                id="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
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