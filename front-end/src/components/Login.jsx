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
            let result = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!result.ok) {
                throw new Error('Network response was not ok');
            }
    
            let ans = await result.json();
            if (ans.name) {
                localStorage.setItem('user', JSON.stringify(ans));
                navigate('/');
            } else {
                alert('Invalid Email or Password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check console for details.');
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